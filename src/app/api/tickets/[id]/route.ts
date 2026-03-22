import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const role = (session.user as { role?: string }).role;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      assignedTo: {
        select: { firstName: true, lastName: true, email: true, phone: true },
      },
      notes: {
        include: {
          author: { select: { firstName: true, lastName: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      messages: {
        include: {
          sender: { select: { firstName: true, lastName: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      survey: true,
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  // Customers can only see their own tickets
  if (
    role !== "ADMIN" &&
    role !== "STAFF" &&
    ticket.userId !== session.user.id
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(ticket);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const role = (session.user as { role?: string }).role;

  if (role !== "ADMIN" && role !== "STAFF") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { status, assignedToId, priority } = body;

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (assignedToId !== undefined) updateData.assignedToId = assignedToId;
    if (priority) updateData.priority = priority;
    if (status === "RESOLVED") updateData.resolvedAt = new Date();

    const ticket = await prisma.ticket.update({
      where: { id },
      data: updateData,
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id as string,
        action: "UPDATE_TICKET",
        resource: `ticket:${id}`,
        details: JSON.stringify(updateData),
      },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Update ticket error:", error);
    return NextResponse.json(
      { error: "Ticket güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
