"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { eachMinuteOfInterval, format, isPast } from "date-fns";
import { cn } from "@/lib/utils";

import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import AlertMessage from "./AlertMessage";

import { useRouter } from "next/navigation";

const postData = async (url: string, data: object) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const Reservation = ({
  reservations,
  room,
  isUserAuthenticated,
  userData,
}: {
  reservations: any;
  room: any;
  isUserAuthenticated: boolean;
  userData: any;
}) => {
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();

  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    type: "error" | "success" | null;
  } | null>(null);

  const router = useRouter();

  const formatDateForStrapi = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      return setAlertMessage(null);
    }, 3000);
    // clear timer
    return () => clearTimeout(timer);
  }, [alertMessage]);

  const saveReservation = async () => {
    if (!checkInDate || !checkOutDate) {
      return setAlertMessage({
        message: "Please select both check-in and check-out dates.",
        type: "error",
      });
    }
    if (checkInDate.getTime() === checkOutDate.getTime()) {
      return setAlertMessage({
        message: "Check-in and check-out dates cannot be the same.",
        type: "error",
      });
    }

    const idMap: Record<number, number> = {
      1: 2,
      2: 4,
      3: 7,
      4: 10,
      5: 12,
      6: 14,
      7: 16,
      8: 18,
    };

    const actualRoom = room.data[0];
    const strapiRoomId = idMap[actualRoom.customID];

    if (!strapiRoomId) {
      return setAlertMessage({
        message: "Room not found in system. Please contact admin.",
        type: "error",
      });
    }

    // filter reservations for the current room and check if any reservation overlaps with the selected dates
    const isReserved = reservations.data
      .filter((item: any) => item.attributes?.room?.id === strapiRoomId)

      .some((item: any) => {
        // check if any reservation overlaps with the selected dates
        const existingCheckIn = new Date(item.attributes.checkin).setHours(
          0,
          0,
          0,
          0
        );
        // converts existing checkin date to midnight
        const existingCheckOut = new Date(item.attributes.checkout).setHours(
          0,
          0,
          0,
          0
        );
        // convert selected check in date to midnight
        const checkInTime = new Date(checkInDate).setHours(0, 0, 0, 0);
        // convert selected check out date to midnight
        const checkOutTime = new Date(checkOutDate).setHours(0, 0, 0, 0);

        // check if the room is reserved between the check in and check out dates
        const isReservedBetweenDates =
          (checkInTime >= existingCheckIn && checkInTime <= existingCheckOut) ||
          (checkOutTime > existingCheckIn &&
            checkOutTime <= existingCheckOut) ||
          (existingCheckIn > checkInTime && existingCheckIn < checkOutTime) ||
          (existingCheckOut > checkInTime && existingCheckOut < checkOutTime);

        return isReservedBetweenDates;
        // returns true is any reservation overlaps with the selected dates
      });

    // if the room is reserved, display an alert message otherwise proceed with booking
    if (isReserved) {
      setAlertMessage({
        message:
          "This room is already booked for the selected dates. Please choose different dates or another room.",
        type: "error",
      });
    } else {
      const data = {
        data: {
          firstname: userData.family_name,
          lastname: userData.given_name,
          email: userData.email,
          checkin: checkInDate ? formatDateForStrapi(checkInDate) : null,
          checkout: checkOutDate ? formatDateForStrapi(checkOutDate) : null,
          room: strapiRoomId,
        },
      };

      // ...............post booking data to the server...........
      await postData("https://booky-be.onrender.com/api/reservations", data);
      setAlertMessage({
        message: "Your reservation is successfully booked.",
        type: "success",
      });
      // refresh the page to reflect the updated reservation status
      router.refresh();
    }
  };

  return (
    <div>
      <div className="bg-tertiary h-[320px] mb-4">
        {/* ........top......... */}
        <div className="bg-accent py-4 text-center relative mb-2 ">
          <h4 className="text-xl text-white">Book your room</h4>
          {/* .......triangle........... */}
          <div
            className="absolute -bottom-[8px] left-[calc(50%_-_10px)] w-0 h-0 border-l-[10px] 
          border-l-transparent border-t-[8px] border-t-accent border-r-[10px] border-r-transparent"
          ></div>
        </div>
        <div className="flex flex-col gap-4 w-full py-6 px-8">
          {/* ...............check in......... */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="default"
                size="md"
                className={cn(
                  "w-full flex justify-start text-left font-semibold",
                  !checkInDate && "text-secondary"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkInDate ? (
                  format(checkInDate, "PPP")
                ) : (
                  <span>Check In</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkInDate}
                onSelect={setCheckInDate}
                initialFocus
                disabled={isPast}
              />
            </PopoverContent>
          </Popover>
          {/* .......check out .......... */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="default"
                size="md"
                className={cn(
                  "w-full flex justify-start text-left font-semibold",
                  !checkOutDate && "text-secondary"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOutDate ? (
                  format(checkOutDate, "PPP")
                ) : (
                  <span>Check Out</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOutDate}
                onSelect={setCheckOutDate}
                initialFocus
                disabled={isPast}
              />
            </PopoverContent>
          </Popover>

          {/* ........conditional rendering of the booking button based on an user authentication status. 
          if the user is authenticated, display a "book now" button with an onclick event handler to save the booking...
          If the user is not authenticated display a "book now" button wrapped inside a login link */}
          {isUserAuthenticated ? (
            <Button onClick={() => saveReservation()} size="md">
              Book Now
            </Button>
          ) : (
            <LoginLink>
              <Button className="w-full" size="md">
                Book Now
              </Button>{" "}
            </LoginLink>
          )}
        </div>
      </div>
      {alertMessage && (
        <AlertMessage message={alertMessage.message} type={alertMessage.type} />
      )}
    </div>
  );
};

export default Reservation;
