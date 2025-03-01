'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronRight, LinkIcon } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

export const Accordions = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
    className?: string;
  }
>(({ className, ...props }, ref) => {
  return (
    <AccordionPrimitive.Root
      ref={ref}
      className={cn(
        'divide-y divide-border overflow-hidden rounded-lg border bg-card',
        className
      )}
      {...props}
    />
  );
});

Accordions.displayName = 'Accordions';

export const Accordion = forwardRef<
  HTMLDivElement,
  Omit<ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>, 'value'> & {
    title: string;
    id: string;
    href?: string;
    avatar_url?: string;
  }
>(({ title, className, id, children, href, avatar_url, ...props }, ref) => {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      value={id ?? title}
      className={cn('group/accordion relative scroll-m-20', className)}
      {...props}
    >
      <AccordionPrimitive.Header
        id={id}
        className="not-prose flex flex-row items-center font-medium text-foreground"
      >
        <AccordionPrimitive.Trigger 
          className="flex flex-1 items-center gap-2 p-4 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        >
          <ChevronRight 
            className="-ms-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/accordion:rotate-90" 
          />
          <img 
            src={avatar_url} 
            alt={`${id}'s avatar`} 
            className="w-8 h-8 rounded-full mr-1"
          />
          {title}
        </AccordionPrimitive.Trigger>
        {href ? <GoToLink id={href} /> : null}
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content 
        className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      >
        <div className="text-muted-foreground p-4 pt-0 prose-no-margin">{children}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
});

function GoToLink({ id }: { id: string }): React.ReactElement {
  const onClick = () => { 
    if (id) {
      window.open(`${id}`, '_blank');
    }
  };

  return (
    <button
      type="button"
      aria-label="Go to"
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md p-2 text-sm font-medium",
        "transition-colors duration-100",
        "hover:bg-accent hover:text-accent-foreground",
        "text-muted-foreground me-2",
      )}
      onClick={onClick}
    >
      <LinkIcon className="h-3.5 w-3.5" />
    </button>
  );
}

Accordion.displayName = 'Accordion';