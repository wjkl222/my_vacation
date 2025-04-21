"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/lib/client/api";
import { queryClient } from "~/lib/client/query-client";

export function Reactions({ hotelId }: { hotelId: string }) {
    
    const { data, isLoading } = useQuery({
        queryKey: ["getReactions", hotelId],
        queryFn: async () => {
            const response = await api.hotels({ id: hotelId }).rating.get();
            return response.data;
        },
    });

    console.log(data ?? "sidvsjhdbvjhsbdjvbsjdbvjsbdvjbsdjvbsjhdbvjsbdvjhsb")

    const [userReaction, setUserReaction] = useState(data?.reaction?.type);

    useEffect(() => {
        if (!isLoading && data) {
            setUserReaction(data.reaction?.type);
        }
    }, [data, isLoading]);


    const reactionMutation = useMutation({
        mutationKey: ["reactionMutation"],
        mutationFn: async (type: "like" | "dislike") => {
            await api.hotels({id: hotelId}).rating.put({type: type})
        },
        onSuccess: (_, variables) => {
            if (userReaction === "like" && variables === "like") {
                setUserReaction(undefined)
            } else if(userReaction === "like" && variables === "dislike") {
                setUserReaction("dislike")
            } else if (userReaction === "dislike" && variables === "dislike") {
                setUserReaction(undefined)
            } else if (userReaction === "dislike" && variables === "like") {
                setUserReaction("like")
            } else {
                setUserReaction(variables)
            }
            queryClient.refetchQueries({
                queryKey: ["getReactions"]
            })
        }
    })



    return (
        <div className="flex flex-row space-x-4 items-centers text-sm">
            <button 
                onClick={() => reactionMutation.mutate("like")} 
                className={`bg-background flex flex-row items-center space-x-1 ${userReaction == "like" ? "text-accent" : "text-muted-foreground"}`}
            >
                <ThumbsUp size={20}/>
                <p>{data?.likesCount ?? 0}</p>
            </button>
            <button
                onClick={() => reactionMutation.mutate("dislike")} 
                className={`bg-background flex flex-row items-center space-x-1 ${userReaction == "dislike" ? "text-red-500" : "text-muted-foreground"}`}
            >
                <ThumbsDown size={20}/>
                <p>{data?.dislikesCount ?? 0}</p>
            </button>
        </div>
    );
}