import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    // ตรวจสอบ JWT token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.sub; // user id จาก JWT

    // รับไฟล์จาก FormData
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ตรวจสอบประเภทไฟล์
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, WebP allowed." }, { status: 400 });
    }

    // ตรวจสอบขนาดไฟล์ (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum 5MB allowed." }, { status: 400 });
    }

    // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // อัปโหลดไฟล์ไป Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user-files') // ใช้ bucket user-files
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }

    // รับ public URL ของไฟล์
    const { data: { publicUrl } } = supabase.storage
      .from('user-files')
      .getPublicUrl(filePath);

    // อัปเดต profile_image ในฐานข้อมูล
    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_image: publicUrl })
      .eq('id', userId); // ใช้ id แทน auth_id

    if (updateError) {
      console.error('Database update error:', updateError);
      // ลบไฟล์ที่อัปโหลดแล้วถ้าอัปเดตฐานข้อมูลล้มเหลว
      await supabase.storage.from('user-files').remove([filePath]);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({ 
      profile_image: publicUrl,
      message: "Profile image updated successfully" 
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}