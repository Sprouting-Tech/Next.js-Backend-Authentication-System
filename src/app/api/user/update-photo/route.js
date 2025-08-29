import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { user },
    error: uerr,
  } = await supabase.auth.getUser()
  if (uerr || !user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file');
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const path = `${user.id}/${crypto.randomUUID()}-${file.name}`

  const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, {
    upsert: true, // ถ้าต้องการทับไฟล์เดิม
    contentType: file.type,
  })
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })

  const { data: pub } = await supabase.storage.from('avatars').getPublicUrl(path)
  const publicUrl = pub.publicUrl

  // ⚠️ ในสครีนช็อต ตาราง users มีทั้ง id(int8) และ auth_id(uuid)
  // ห้าม .eq('id', user.id) เพราะประเภทไม่ตรง ให้ใช้ .eq('auth_id', user.id)
  const { error: updErr } = await supabase
    .from('users')
    .update({ profile_image: publicUrl })
    .eq('auth_id', user.id)

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 })

  return NextResponse.json({ profile_image: publicUrl })
}