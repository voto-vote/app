"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

function Switch({
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className="w-11 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:shadow-xs hover:data-[state=checked]:bg-primary/90 transition-colors"
      {...props}
    >
      <SwitchPrimitive.Thumb
        className="block w-5 h-5 bg-white rounded-full shadow transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }