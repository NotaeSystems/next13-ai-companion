"use client";

import qs from "query-string";
import { Category } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Topic } from "@prisma/client";
import { cn } from "@/lib/utils";
//import { Topics } from "@/components/topics";
interface TopicsProps {
  topics: Topic[];
}

export const TopicsPanel = ({ topics }: TopicsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const topicId = searchParams.get("topicId");

  const onClick = (id: string | undefined) => {
    const query = { topicId: id };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <>
      <div className="w-full overflow-x-auto space-x-2 flex p-1">
        <button
          onClick={() => onClick(undefined)}
          className={cn(
            `
          flex 
          items-center 
          text-center 
          text-xs 
          md:text-sm 
          px-2 
          md:px-4 
          py-2 
          md:py-3 
          rounded-md 
          bg-primary/10 
          hover:opacity-75 
          transition
        `,
            !topicId ? "bg-primary/25" : "bg-primary/10"
          )}
        >
          Newest
        </button>
        {topics.map((topic) => (
          <button
            onClick={() => onClick(topic.id)}
            className={cn(
              `
            flex 
            items-center 
            text-center 
            text-xs 
            md:text-sm 
            px-2 
            md:px-4 
            py-2 
            md:py-3 
            rounded-md 
            bg-primary/10 
            hover:opacity-75 
            transition
          `,
              topic.id === topicId ? "bg-primary/25" : "bg-primary/10"
            )}
            key={topic.id}
          >
            {topic.name}
          </button>
        ))}
      </div>
    </>
  );
};
