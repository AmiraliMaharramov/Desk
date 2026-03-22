import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      userType,
      companyName,
      taxOffice,
      taxNumber,
      nationalId,
      invoiceTitle,
      invoiceAddress,
      serviceAgreement,
      dataAccuracy,
    } = body;

    // Validate required fields
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !serviceAgreement ||
      !dataAccuracy
    ) {
      return NextResponse.json(
        { error: "Tüm zorunlu alanlar doldurulmalıdır." },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kayıtlı." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        userType: userType || "INDIVIDUAL",
        companyName: userType === "CORPORATE" ? companyName : null,
        taxOffice: userType === "CORPORATE" ? taxOffice : null,
        taxNumber: userType === "CORPORATE" ? taxNumber : null,
        nationalId,
        invoiceTitle: userType === "CORPORATE" ? invoiceTitle : null,
        invoiceAddress: userType === "CORPORATE" ? invoiceAddress : null,
      },
    });

    return NextResponse.json(
      {
        message: "Kayıt başarılı.",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Kayıt işlemi sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
