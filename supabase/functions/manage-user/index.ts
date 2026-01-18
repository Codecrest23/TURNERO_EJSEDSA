// supabase/functions/manage-user/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Action = "list" | "create" | "update" | "delete";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  // Preflight CORS
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (req.method !== "POST") {
    return json({ error: "Método no permitido" }, 405);
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // 1) Validar JWT del caller
    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return json({ error: "No autorizado (falta token)" }, 401);
    }

    // Cliente "user" (anon) para obtener user desde el JWT
    const supabaseUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const {
      data: { user },
      error: userErr,
    } = await supabaseUser.auth.getUser();

    if (userErr || !user) {
      return json({ error: "Token inválido o sesión expirada" }, 401);
    }

    // 2) Chequear rol en tu tabla perfiles
    // ⚠️ Si tu FK se llama distinto, cambiá "id_usuario" acá abajo.
    const { data: perfil, error: perfilErr } = await supabaseUser
      .from("perfiles")
      .select("perfil_rol")
      .eq("id_usuario", user.id)
      .maybeSingle();

    if (perfilErr) {
      return json({ error: "Error leyendo perfil", details: perfilErr.message }, 500);
    }

    const rol = perfil?.perfil_rol;
    const allowed = rol === "Admin" || rol === "Supervisor";
    if (!allowed) {
      return json({ error: "No autorizado (rol insuficiente)" }, 403);
    }

    // 3) Parse body
    const { action, userData } = (await req.json()) as {
      action: Action;
      userData?: any;
    };

    if (!action) return json({ error: "Falta action" }, 400);

    // Cliente "admin" (service role) para operaciones sensibles
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Helpers
    const safeEmail = (s?: string) => (typeof s === "string" ? s.trim().toLowerCase() : "");
    const pickPerfil = (ud: any) => ({
      perfil_nombre: ud?.perfil_nombre ?? null,
      perfil_rol: ud?.perfil_rol ?? null,
      perfil_id_empleado: ud?.perfil_id_empleado ?? null,
    });

    // 4) Actions
    if (action === "list") {
      // Lista users de auth + perfiles (lo más útil para tu UI)
      const { data: authUsers, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      if (listErr) return json({ error: listErr.message }, 500);

      // Traemos perfiles y los mapeamos por user_id
      const { data: perfiles, error: perfErr } = await supabaseAdmin
        .from("perfiles")
        .select("id_usuario, perfil_nombre, perfil_rol, perfil_id_empleado");

      if (perfErr) return json({ error: perfErr.message }, 500);

      const perfilById = new Map<string, any>();
      for (const p of perfiles || []) perfilById.set(p.id_usuario, p);

      const users = (authUsers?.users || []).map((u) => {
        const p = perfilById.get(u.id);
        return {
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          perfil_nombre: p?.perfil_nombre ?? null,
          perfil_rol: p?.perfil_rol ?? null,
          perfil_id_empleado: p?.perfil_id_empleado ?? null,
        };
      });

      return json({ users });
    }

    if (action === "create") {
      const email = safeEmail(userData?.email);
      const password = userData?.password;

      if (!email || !password) return json({ error: "Email y password son obligatorios" }, 400);

      // Crear usuario Auth
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (createErr) return json({ error: createErr.message }, 400);

      const newUserId = created.user?.id;
      if (!newUserId) return json({ error: "No se pudo obtener el id del usuario creado" }, 500);

      // Upsert perfil
      const { error: upErr } = await supabaseAdmin
        .from("perfiles")
        .upsert(
          { id_usuario: newUserId, ...pickPerfil(userData) },
          { onConflict: "id_usuario" }
        );

      if (upErr) return json({ error: upErr.message }, 400);

      return json({ ok: true, id: newUserId });
    }

    if (action === "update") {
      const id = userData?.id;
      if (!id) return json({ error: "Falta id" }, 400);

      const patch: any = {};
      const email = userData?.email ? safeEmail(userData.email) : null;
      const password = userData?.password ? String(userData.password) : null;
      if (email) patch.email = email;
      if (password) patch.password = password;

      if (Object.keys(patch).length > 0) {
        const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(id, patch);
        if (updErr) return json({ error: updErr.message }, 400);
      }

      // Perfil (siempre podés actualizar)
      const { error: profErr } = await supabaseAdmin
        .from("perfiles")
        .upsert(
          { id_usuario: id, ...pickPerfil(userData) },
          { onConflict: "id_usuario" }
        );

      if (profErr) return json({ error: profErr.message }, 400);

      return json({ ok: true });
    }

    if (action === "delete") {
      const id = userData?.id;
      if (!id) return json({ error: "Falta id" }, 400);

      // (Opcional) borrar perfil primero
      await supabaseAdmin.from("perfiles").delete().eq("id_usuario", id);

      const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(id);
      if (delErr) return json({ error: delErr.message }, 400);

      return json({ ok: true });
    }

    return json({ error: "Action inválida" }, 400);
  } catch (e) {
    return json({ error: "Error inesperado", details: String(e?.message ?? e) }, 500);
  }
});
