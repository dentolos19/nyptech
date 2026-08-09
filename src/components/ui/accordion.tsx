import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { Plus } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "#/lib/utils.ts";

function Accordion({
  className,
  ...props
}: Omit<ComponentProps<"div">, 'defaultValue'>) {
  return (
    <AccordionPrimitive.Root
      className={cn("divide-border border-border divide-y border-t border-b", className)}
      {...props}
    />
  );
}

function AccordionItem({
  question,
  children,
  value,
}: {
  question: ReactNode;
  children: ReactNode;
  value: string;
}) {
  return (
    <AccordionPrimitive.Item value={value} className="group">
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
          className={cn(
            "flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left",
            "text-base font-medium text-foreground outline-none transition-colors",
            "hover:text-brand focus-visible:text-brand",
            "[&[data-panel-open]_svg]:rotate-45 [&[data-panel-open]]:text-brand",
          )}
        >
          {question}
          <span className="bg-brand-soft text-brand grid size-7 shrink-0 place-items-center rounded-full">
            <Plus className="size-4 transition-transform duration-300" />
          </span>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Panel className="faq-panel">
        <p className="text-muted-foreground max-w-2xl pr-10 pb-5 text-[15px] leading-relaxed">
          {children}
        </p>
      </AccordionPrimitive.Panel>
    </AccordionPrimitive.Item>
  );
}

export { Accordion, AccordionItem };
