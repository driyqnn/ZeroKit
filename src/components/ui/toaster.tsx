
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useEffect, useState } from "react"

export function Toaster() {
  const { toasts } = useToast()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    // Initial check
    checkMobile()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="animate-slide-in-right">
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport className={isMobile ? "top-0 right-0" : "bottom-0 right-0"} />
    </ToastProvider>
  )
}
