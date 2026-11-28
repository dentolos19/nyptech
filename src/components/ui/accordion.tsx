import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { Plus } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "#/lib/utils.ts";

function Accordion({ className, ...props }: Omit<ComponentProps<"div">, "defaultValue">) {
  return (
    <AccordionPrimitive.Root
      className={cn("divide-y divide-border border-t border-b border-border", className)}
      {...props}
    />
  );
}

function AccordionItem({ question, children, value }: { question: ReactNode; children: ReactNode; value: string }) {
  return (
    <AccordionPrimitive.Item value={value} className="group">
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
          className={cn(
            "flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left",
            "text-base font-medium text-foreground transition-colors outline-none",
            "hover:text-brand focus-visible:text-brand",
            "[&[data-panel-open]]:text-brand [&[data-panel-open]_svg]:rotate-45",
          )}
        >
          {question}
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
            <Plus className="size-4 transition-transform duration-300" />
          </span>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Panel className="faq-panel">
        <p className="max-w-2xl pr-10 pb-5 text-[15px] leading-relaxed text-muted-foreground">{children}</p>
      </AccordionPrimitive.Panel>
    </AccordionPrimitive.Item>
  );
}

export { Accordion, AccordionItem };
