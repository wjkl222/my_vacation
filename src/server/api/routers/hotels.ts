import Elysia, { error, t } from "elysia";
import { userService } from "./user";
import { db } from "~/server/db";
import { hotelRating, hotelRooms, hotels, hotelsToFacilities, hotelsToTreatmentIndications } from "~/server/db/hotel";
import { and, asc, eq, ilike, gte, inArray, sql, desc } from "drizzle-orm";
import { bookings } from "~/server/db/bookings";
import { medicalBases, treatmentIndications } from "~/server/db/medicine";
import { facilities } from "~/server/db/facilities";


const hotelTypeModel = t.Union([t.Literal("hotel"), t.Literal("apartment")]);

export const hotelsModels = new Elysia({ name: "hotels/models" }).model({
  id: t.Object({
    id: t.String(),
  }),
  roomId: t.Object({
    id: t.String(),
    roomId: t.String(),
  }),

  hotel: t.Object({
    id: t.Optional(t.String()),
    name: t.String({ minLength: 1, maxLength: 255 }),
    description: t.String({ minLength: 1 }),
    rating: t.String({ pattern: "^[0-5](\\.[0-9])?$" }),
    country: t.String(),
    image: t.String({ minLength: 1 }),
    medicalBase: t.String({ minLength: 1, maxLength: 255 }),
    treatmentIndications: t.Array(t.String({ minLength: 1, maxLength: 255 })),
    facilities: t.Array(t.String({ minLength: 1, maxLength: 255 })),
    isFeatured: t.Boolean(),
    isDeleted: t.Optional(t.Boolean()),
    createdAt: t.Optional(t.Date()),
    updatedAt: t.Optional(t.Date()),
  }),

  hotelRoom: t.Object({
    id: t.Optional(t.String()),
    name: t.String({ minLength: 1, maxLength: 255 }),
    image: t.String(),
    hotelId: t.String({ minLength: 1, maxLength: 255 }),
    size: t.Integer({ minimum: 1 }),
    pricePerNight: t.Integer({ minimum: 1 }),
    description: t.String(),
    isDeleted: t.Optional(t.Boolean()),
    createdAt: t.Optional(t.Date()),
    updatedAt: t.Optional(t.Date()),
  })
})

export const hotelsRouter = new Elysia({ prefix: "/hotels" })
  .use(userService)
  .use(hotelsModels)
  .post(
    "/",
    async ({ body }) => {
      const [createdHotel] = await db.insert(hotels).values({
        ...body,
        rating: body.rating.toString(),
      }).returning();

      body.facilities.forEach(async facility => {
        await db.insert(hotelsToFacilities).values({
          hotelId: createdHotel!.id,
          facilityId: facility
        })
      })

      body.treatmentIndications.forEach(async treatmentIndication => {
        await db.insert(hotelsToTreatmentIndications).values({
          hotelId: createdHotel!.id,
          treatmentIndicationId: treatmentIndication
        })
      })
    },
    {
      body: "hotel",
      isSignedIn: true,
      hasRole: "admin"
    },
  )
  .put(
    "/:id",
    async ({ body, params }) => {
      await db.update(hotels).set(body).where(eq(hotels.id, params.id));
      if (body.facilities) {
        await db.delete(hotelsToFacilities).where(eq(hotelsToFacilities.hotelId, params.id))
        body.facilities.forEach(async facility => {
          await db.insert(hotelsToFacilities).values({
            hotelId: params.id,
            facilityId: facility
          })
        })
      }
      if (body.treatmentIndications) {
        await db.delete(hotelsToTreatmentIndications).where(eq(hotelsToTreatmentIndications.hotelId, params.id))
        body.treatmentIndications.forEach(async treatmentIndication => {
          await db.insert(hotelsToTreatmentIndications).values({
            hotelId: params.id,
            treatmentIndicationId: treatmentIndication
          })
        })
      }
    },
    {
      body: "hotel",
      params: "id",
      isSignedIn: true,
      hasRole: "admin"
    },
  )
  .delete(
    "/:id",
    async ({ params }) => {
      await db
        .update(hotels)
        .set({ isDeleted: true, isFeatured: false })
        .where(eq(hotels.id, params.id));
    },
    {
      params: "id",
      isSignedIn: true,
      hasRole: "admin"
    },
  )
  .get("/find/:query", async ({ params }) => {
    type CountryResult = { country: string };

    const resultHotels = (await db.select().from(hotels).where(ilike(hotels.name, `%${decodeURIComponent(params.query)}`)))

    const countriesResult: CountryResult[] = await db
      .selectDistinct({ country: hotels.country })
      .from(hotels)
      .where(and(
        eq(hotels.isDeleted, false),
        ilike(hotels.country, `%${decodeURIComponent(params.query)}%`)
      ));

    const resultTreatmentIndications = await db.select().from(treatmentIndications).where(ilike(treatmentIndications.name, `%${decodeURIComponent(params.query)}`))
    return {
      hotels: resultHotels,
      treatmentIndications: resultTreatmentIndications,
      countries: countriesResult.map(item => item.country)
    }
  }, {
    params: t.Object({
      query: t.String()
    })
  })
  .get("/all", async () => {
    const result = await db.query.hotels.findMany({
      where: eq(hotels.isDeleted, false),
      with: {
        treatmentIndications: {
          columns: {},
          with: {
            treatmentIndication: true
          }
        },
        facilities: {
          columns: {},
          with: {
            facility: true
          }
        },
        medicalBase: true
      }
    });

    const formatted = result.map(hotel => ({
      ...hotel,
      facilities: hotel.facilities.map(f => f.facility),
      treatmentIndications: hotel.treatmentIndications.map(ti => ti.treatmentIndication)
    }));

    return { hotels: formatted };
  })
  .get("/featured", async () => {
    const result = await db.query.hotels.findMany({
      where: eq(hotels.isDeleted, false),
      with: {
        rooms: true
      }
    })

    const hotelsWithMinPrice = result.map(hotel => {
      const cheapestRoom = hotel.rooms.reduce((prev, current) =>
        (prev.pricePerNight < current.pricePerNight) ? prev : current
      );

      return {
        ...hotel,
        minPrice: cheapestRoom.pricePerNight
      };
    });

    const resultHotels = hotelsWithMinPrice.filter((hotel) => hotel.minPrice <= 3000 && parseFloat(hotel.rating) >= 4.5)

    return { hotels: resultHotels }
  })
  .get(
    "/",
    async ({ query }) => {

      console.log(query.filters?.price)

      const hotelIdsWithFacilities = query.filters?.facilities?.length
        ? await db
          .selectDistinct({ hotelId: hotelsToFacilities.hotelId })
          .from(hotelsToFacilities)
          .where(inArray(hotelsToFacilities.facilityId, query.filters.facilities))
          .then(rows => rows.map(row => row.hotelId))
        : null;

      const hotelIdsWithTreatments = query.filters?.treatmentIndications?.length
        ? await db
          .selectDistinct({ hotelId: hotelsToTreatmentIndications.hotelId })
          .from(hotelsToTreatmentIndications)
          .where(inArray(hotelsToTreatmentIndications.treatmentIndicationId, query.filters.treatmentIndications))
          .then(rows => rows.map(row => row.hotelId))
        : null;

      const htls = await db.query.hotels.findMany({
        where: and(
          eq(hotels.isDeleted, false),
          eq(hotels.isFeatured, query.isFeatured ?? false).if(query.isFeatured),
          query.filters?.rating ? gte(sql`${hotels.rating}::numeric`, sql`${query.filters.rating}::numeric`) : undefined,
          eq(hotels.medicalBase, query.filters?.medicalBase ?? "").if(query.filters?.medicalBase),
          inArray(hotels.id, hotelIdsWithFacilities ?? []).if((query.filters?.facilities?.length ?? 0) > 0),
          inArray(hotels.id, hotelIdsWithTreatments ?? []).if((query.filters?.treatmentIndications?.length ?? 0) > 0),
          inArray(hotels.country, query.filters?.country ?? []).if((query.filters?.country?.length ?? 0) > 0),
        ),
        with: {
          facilities: {
            columns: {},
            with: {
              facility: true
            }
          },
          treatmentIndications: {
            columns: {},
            with: {
              treatmentIndication: true
            }
          },
          medicalBase: true,
          rooms: true,
        },
        orderBy: query.filters?.sortPopularityUp
          ? asc(hotels.rating)
          : desc(hotels.rating)
      });

      let currentHotels = htls.map(hotel => ({
        ...hotel,
        facilities: hotel.facilities.map(f => f.facility),
        treatmentIndications: hotel.treatmentIndications.map(t => t.treatmentIndication)
      }))

      if (query.filters?.price) {
        currentHotels = currentHotels.filter(hotel => hotel.rooms && hotel.rooms[0] && hotel.rooms[0].pricePerNight < parseInt(query.filters?.price!))
      }

      return {
        hotels: currentHotels
      };
    },
    {
      query: t.Optional(
        t.Object({
          isFeatured: t.Optional(t.Boolean()),
          dates: t.Optional(
            t.Object({
              startDate: t.Date(),
              endDate: t.Date(),
            }),
          ),
          filters: t.Optional(
            t.Object({
              rating: t.Optional(t.Number({ minimum: 0, maximum: 5 })),
              country: t.Optional(t.Array(t.String())),
              medicalBase: t.Optional(t.String()),
              facilities: t.Optional(t.Array(t.String())),
              treatmentIndications: t.Optional(t.Array(t.String())),
              price: t.Optional(t.String()),
              sortPopularityUp: t.Optional(t.Boolean())
            }),
          ),
        }),
      ),
    },
  )
  .get("/filterValues", async () => {

    type CountryResult = { country: string };
    type MedicalBaseItem = { id: string; name: string };
    type FacilityItem = { id: string; name: string };
    type TreatmentIndicationItem = { id: string; name: string };

    const countriesData: CountryResult[] = await db
      .selectDistinct({ country: hotels.country })
      .from(hotels)
      .where(eq(hotels.isDeleted, false));

    const medicalBasesFromDB: MedicalBaseItem[] = await db
      .select({
        id: medicalBases.id,
        name: medicalBases.name
      })
      .from(medicalBases);

    const facilitiesFromDB: FacilityItem[] = await db
      .select({
        id: facilities.id,
        name: facilities.name
      })
      .from(facilities);

    const treatmentIndicationsFromDB: TreatmentIndicationItem[] = await db
      .select({
        id: treatmentIndications.id,
        name: treatmentIndications.name
      })
      .from(treatmentIndications);

    const countries = countriesData
      .map((row) => row.country)
      .filter((country): country is string => Boolean(country));

    const medicalBaseItems = medicalBasesFromDB
      .filter((item): item is MedicalBaseItem => Boolean(item.id && item.name));

    const facilityItems = facilitiesFromDB
      .filter((item): item is FacilityItem => Boolean(item.id && item.name));

    const treatmentIndicationItems = treatmentIndicationsFromDB
      .filter((item): item is TreatmentIndicationItem => Boolean(item.id && item.name));

    return {
      countries: [...new Set(countries)],
      medicalBases: medicalBaseItems,
      facilities: facilityItems,
      treatmentIndications: treatmentIndicationItems,
    };
  })
  .get(
    "/:id",
    async ({ params }) => {
      const hotel = await db.query.hotels.findFirst({
        where: and(eq(hotels.id, params.id), eq(hotels.isDeleted, false)),
        with: {
          rooms: {
            with: {
              bookings: {
                columns: {
                  startDate: true,
                  endDate: true,
                },
                where: eq(bookings.isActive, true),
              },
            },
          },
          facilities: {
            with: {
              facility: true
            }
          }
        },
      });

      if (!hotel) {
        return error(404, "Отель не найден");
      }

      return hotel;
    },
    {
      params: "id",
    },
  )
  .post(
    "/:id/rooms",
    async ({ params, body }) => {
      await db.insert(hotelRooms).values({
        ...body,
        hotelId: params.id,
      });
    },
    {
      params: "id",
      body: "hotelRoom",
      isSignedIn: true,
      hasRole: "admin"
    },
  )
  .put(
    "/:id/rooms/:roomId",
    async ({ body, params }) => {
      await db
        .update(hotelRooms)
        .set(body)
        .where(eq(hotelRooms.id, params.roomId));
    },
    {
      params: "roomId",
      body: "hotelRoom",
      isSignedIn: true,
      hasRole: "admin"
    },
  )
  .delete(
    "/:id/rooms/:roomId",
    async ({ params }) => {
      await db
        .update(hotelRooms)
        .set({ isDeleted: true })
        .where(eq(hotelRooms.id, params.roomId));
    },
    {
      isSignedIn: true,
      hasRole: "admin",
      params: "roomId",
    },
  )
  .get("/rooms/featured", async () => {
    return {
      rooms: await db.query.hotelRooms.findMany({
        where: eq(hotelRooms.isDeleted, false),
        with: {
          hotel: true,
          bookings: true
        }
      }),
    };
  })
  .get("/roomsByHotelId/:id", async ({ params }) => {
    const result = await db.query.hotelRooms.findMany({
      where: and(eq(hotelRooms.isDeleted, false), eq(hotelRooms.hotelId, params.id)),
      with: {
        hotel: true,
        bookings: true
      }
    })
    return { rooms: result }
  })
  .get(
    "/room/:roomId",
    async ({ params }) => {
      const room = await db.query.hotelRooms.findFirst({
        where: eq(hotelRooms.id, params.roomId),
        with: {
          hotel: true,
        },
      });
      return room;
    },
    {
      params: t.Object({
        roomId: t.String(),
      }),
    },
  )
  .get("/withBookings", async () => {
    const result = await db.query.hotelRooms.findMany({
      with: {
        bookings: {
          columns: {
            startDate: true,
            endDate: true
          }
        }
      }
    })
    return {
      rooms: result
    }
  })
  .get(
    "/:id/rooms/:roomId/bookings",
    async ({ params }) => {
      const bkngs = await db.query.bookings.findMany({
        where: and(
          eq(bookings.hotelId, params.id),
          eq(bookings.roomId, params.roomId),
          eq(bookings.isActive, true),
        ),
      });

      return { bookings: bkngs };
    },
    {
      params: "roomId",
    },
  )
  .put("/:id/rating", async ({ params, body, session }) => {
    const isLiked = await db.query.hotelRating.findFirst({
      where: and(
        eq(hotelRating.hotelId, params.id),
        eq(hotelRating.userId, session!.user.id),
      ),
      columns: {
        id: true,
        type: true,
      },
    });

    if (isLiked?.type === body.type) {
      await db
        .delete(hotelRating)
        .where(
          and(
            eq(hotelRating.hotelId, params.id),
            eq(hotelRating.userId, session!.user.id),
          ),
        );
      return;
    }

    if (isLiked) {
      await db
        .update(hotelRating)
        .set({
          type: body.type,
        })
        .where(
          and(
            eq(hotelRating.hotelId, params.id),
            eq(hotelRating.userId, session!.user.id),
          ),
        );
      return;
    }

    await db.insert(hotelRating).values({
      hotelId: params.id,
      userId: session!.user.id,
      type: body.type,
    });
  },
    {
      isSignedIn: true,
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        type: t.UnionEnum(["like", "dislike"]),
      }),
    },
  )
  .get("/:id/rating", async ({ params, session }) => {
    console.log(params.id)
    console.log(session?.user.id)
    const isLiked = await db.query.hotelRating.findFirst({
      where: and(
        eq(hotelRating.hotelId, params.id),
        eq(hotelRating.userId, session!.user.id),
      ),
      columns: {
        id: true,
        type: true,
      },
    });

    const likes = await db.query.hotelRating.findMany({
      where: eq(hotelRating.type, "like")
    })

    const dislikes = await db.query.hotelRating.findMany({
      where: eq(hotelRating.type, "dislike")
    })

    return {
      reaction: isLiked,
      likesCount: likes.length,
      dislikesCount: dislikes.length
    }
  })

