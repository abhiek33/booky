"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { FaStar, FaStarHalf } from "react-icons/fa";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RoomList = ({ rooms }: { rooms: any }) => {
  const [roomType, setRoomType] = useState("all");
  const [filteredRooms, setFilteredRooms] = useState([]);

  useEffect(() => {
    if (rooms && rooms.data) {
      const filtered = rooms.data.filter((room: any) => {
        return roomType === "all" ? true : roomType === room.type;
      });
      setFilteredRooms(filtered);
    }
  }, [roomType, rooms]);

  console.log("ROOMS:", rooms);

  return (
    <section className="py-16 min-h-[90vh]">
      {/* ..........image & title....... */}
      <div className="flex flex-col items-center ">
        {/* ......image....... */}
        <div className="relative w-[82px] h-[20px]">
          <Image
            src={"/assets/heading-icon.svg"}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <h2 className="h2 mb-8">Our Rooms</h2>
      </div>

      {/* .............tabs........... */}
      <Tabs
        defaultValue="all"
        className="w-[240px] lg:w-[540px] h-[200px] lg:h-auto mb-8 mx-auto"
      >
        <TabsList className="w-full h-full lg:h-[46px] flex flex-col lg:flex-row">
          <TabsTrigger
            className="w-full h-full"
            value="all"
            onClick={() => setRoomType("all")}
          >
            All
          </TabsTrigger>
          <TabsTrigger
            className="w-full h-full"
            value="single"
            onClick={() => setRoomType("single")}
          >
            Single
          </TabsTrigger>
          <TabsTrigger
            className="w-full h-full"
            value="double"
            onClick={() => setRoomType("double")}
          >
            Double
          </TabsTrigger>
          <TabsTrigger
            className="w-full h-full"
            value="extended"
            onClick={() => setRoomType("extended")}
          >
            Extended
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ...........room list............... */}
      <div className=" grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-10 sm:mx-30">
        {filteredRooms.map((room: any) => {
          const imgURL = `https://booky-be.onrender.com${room.image?.url}`;
          return (
            <div key={room.id}>
              <Link href={`/room/${room.customID}`}>
                <div className="relative w-full h-[300px] overflow-hidden mb-6">
                  <Image
                    src={imgURL}
                    alt=""
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </Link>
              <div className="h-[134px]">
                <div className="flex items-center justify-between mb-6">
                  <div>Capacity - {room.capacity} person </div>
                  <div className="flex gap-1 text-accent">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStarHalf />
                  </div>
                </div>
                <Link href={`/room/${room.customID}`}>
                  <h3 className="h3">{room.title}</h3>
                </Link>
                <p className="h3 font-secondary font-medium text-accent mb-4">
                  {room.price}
                  <span className="text-base text-secondary"> / night</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RoomList;
