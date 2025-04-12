import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";

const getUserReservations = async (userEmail: any) => {
  try {
    const res = await fetch(
      `http://booky-be.onrender.com/api/reservations?[filters][email]$eq=${userEmail}&populate=*`,
      {
        next: {
          revalidate: 0,
        },
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch reservations:", res.statusText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return null;
  }
};

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import CancelReservation from "@/components/CancelReservation";

const Dashboard = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userReservations = await getUserReservations(user?.email);
  return (
    <section className="min-h-[80vh]">
      <div className="container mx-auto py-8 h-full">
        <h3 className="h3 font-bold mb-12 border-b pb-4 text-center lg:text-left">
          My bookings
        </h3>
        <div className="flex flex-col gap-8 h-full">
          {userReservations.data.length < 1 ? (
            <div className="flex flex-col items-center justify-center h-[50vh]">
              <p className="text-xl text-center text-secondary/70 mb-4">
                You don't have any reservations.{" "}
              </p>
              {/* ..........back to homepage........ */}
              <Link href="/">
                <Button size="md">Go to homepage</Button>
              </Link>
            </div>
          ) : (
            userReservations.data.map((reservation: any) => {
              return (
                <div key={reservation.id} className="bg-tertiary py-8 px-12">
                  <div className="flex flex-col gap-4 lg:flex-row items-center justify-between ">
                    <h3 className="text-2xl font-medium w-[300px] text-center">
                      {reservation.room.title}
                    </h3>
                    {/* ........check in and check out text............ */}
                    <div className="flex flex-col lg:flex-row lg:w-[380px] gap-2">
                      {/* ..........check in........ */}
                      <div className="flex items-center gap-1 flex-1">
                        <span className="text-accent font-bold uppercase tracking-[2px]">
                          From:
                        </span>
                        <span className="text-secondary font-semibold">
                          {format(reservation.checkin, "PPP")}
                        </span>
                      </div>
                      {/* ............check out.......... */}
                      <div className="flex items-center gap-1 flex-1">
                        <span className="text-accent font-bold uppercase tracking-[2px]">
                          to:
                        </span>
                        <span className="text-secondary font-semibold">
                          {format(reservation.checkout, "PPP")}
                        </span>
                      </div>
                    </div>
                    <CancelReservation reservation={reservation} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
