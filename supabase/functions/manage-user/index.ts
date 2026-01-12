import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// ==========================================================
// 🔹 Inicialización del cliente con permisos de administrador
// ==========================================================
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

// ==========================================================
// 🔹 Headers CORS para permitir llamadas desde localhost:5173
// ==========================================================
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  }
}

// ==========================================================
// 🔹 Función principal
// ==========================================================
serve(async (req) => {
  // ✅ Manejo de preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders() })
  }

  try {
    const { action, userData } = await req.json()

    // ======================================================
    // 🔸 CREAR USUARIO
    // ======================================================
    if (action === "create") {
      const { email, password, perfil_nombre, perfil_rol, perfil_id_empleado } = userData
      if (perfil_rol === "Empleado" && !perfil_id_empleado) {
        return new Response(JSON.stringify({ error: "Debe seleccionar un empleado para el rol Empleado" }), {
          status: 400,
          headers: corsHeaders(),
        })
      }

      // Crear usuario en auth
      const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

      if (authError) {
        return new Response(JSON.stringify({ error: authError.message }), {
          status: 400,
          headers: corsHeaders(),
        })
      }

      // Crear perfil asociado
      const { error: perfilError } = await supabase.from("perfiles").insert([
        {
          id_usuario: newUser.user.id,
          perfil_nombre,
          perfil_rol,
          perfil_id_empleado: perfil_rol === "Empleado" ? perfil_id_empleado : null,
        },
      ])

      if (perfilError) {
        return new Response(JSON.stringify({ error: perfilError.message }), {
          status: 400,
          headers: corsHeaders(),
        })
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: corsHeaders(),
      })
    }

    // ======================================================
    // 🔸 ACTUALIZAR USUARIO
    // ======================================================
    if (action === "update") {
      const { id, email, password, perfil_nombre, perfil_rol, perfil_id_empleado  } = userData
    
      if (perfil_rol === "Empleado" && !perfil_id_empleado) {
      return new Response(JSON.stringify({ error: "Debe seleccionar un empleado para el rol Empleado" }), {
        status: 400,
        headers: corsHeaders(),
      })
    }

      // Actualizar datos en auth
      const { error: authError } = await supabase.auth.admin.updateUserById(id, {
        email,
        password,
      })

      if (authError) {
        return new Response(JSON.stringify({ error: authError.message }), {
          status: 400,
          headers: corsHeaders(),
        })
      }

      // Actualizar datos del perfil
      const { error: perfilError } = await supabase
        .from("perfiles")
        .update({
          perfil_nombre,
          perfil_rol,
          perfil_id_empleado: perfil_rol === "Empleado" ? perfil_id_empleado : null,
        })
        .eq("id_usuario", id)

      if (perfilError) {
        return new Response(JSON.stringify({ error: perfilError.message }), {
          status: 400,
          headers: corsHeaders(),
        })
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: corsHeaders(),
      })
    }

    // ======================================================
    // 🔸 ELIMINAR USUARIO
    // ======================================================
    if (action === "delete") {
      const { id } = userData

      // Borrar usuario en auth
      const { error: authError } = await supabase.auth.admin.deleteUser(id)
      if (authError) {
        return new Response(JSON.stringify({ error: authError.message }), {
          status: 400,
          headers: corsHeaders(),
        })
      }

      // Borrar perfil asociado
      const { error: perfilError } = await supabase.from("perfiles").delete().eq("id_usuario", id)
      if (perfilError) {
        return new Response(JSON.stringify({ error: perfilError.message }), {
          status: 400,
          headers: corsHeaders(),
        })
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: corsHeaders(),
      })
    }

    // ======================================================
    // 🔸 LISTAR USUARIOS (con email desde auth)
    // ======================================================
    if (action === "list") {
      const { data: perfiles, error: perfilesError } = await supabase
        .from("perfiles")
        .select("id_usuario, perfil_nombre, perfil_rol,perfil_id_empleado")
        .order("perfil_nombre", { ascending: true })

      if (perfilesError) {
        return new Response(JSON.stringify({ error: perfilesError.message }), {
          status: 400,
          headers: corsHeaders(),
        })
      }

      const { data: usersList, error: listError } = await supabase.auth.admin.listUsers()
      if (listError) {
        return new Response(JSON.stringify({ error: listError.message }), {
          status: 400,
          headers: corsHeaders(),
        })
      }

      const merged = perfiles.map((p) => {
        const match = usersList.users.find((u) => u.id === p.id_usuario)
        return { ...p, email: match?.email || "—" }
      })

      return new Response(JSON.stringify({ users: merged }), {
        status: 200,
        headers: corsHeaders(),
      })
    }

    // ======================================================
    // 🔸 Si no hay acción válida
    // ======================================================
    return new Response(JSON.stringify({ error: "Acción no válida" }), {
      status: 400,
      headers: corsHeaders(),
    })
  } catch (err) {
    console.error("Error en manage-user:", err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders(),
    })
  }
})
