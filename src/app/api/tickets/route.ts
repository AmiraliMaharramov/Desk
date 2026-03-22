import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function generateTicketNumber() {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `TKT-${dateStr}-${random}`;
}

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const role = (session.user as { role?: string }).role;

  const where =
    role === "ADMIN" || role === "STAFF" ? {} : { userId: userId as string };

  const tickets = await prisma.ticket.findMany({
    where,
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      assignedTo: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tickets);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      department,
      service,
      priority,
      ticketType,
      subject,
      message,
      attachments,
      address,
      deviceInfo,
      remoteToolInfo,
    } = body;

    if (!department || !subject || !message) {
      return NextResponse.json(
        { error: "Departman, konu ve mesaj zorunludur." },
        { status: 400 }
      );
    }

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber: generateTicketNumber(),
        userId: session.user.id as string,
        department,
        service,
        priority: priority || "MEDIUM",
        ticketType: ticketType || "GENERAL",
        subject,
        message,
        attachments,
        address,
        deviceInfo,
        remoteToolInfo,
        slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h default SLA
      },
    });

    // Create survey record
    await prisma.survey.create({
      data: { ticketId: ticket.id },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Create ticket error:", error);
    return NextResponse.json(
      { error: "Destek talebi oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}
