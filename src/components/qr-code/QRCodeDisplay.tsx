import React, { useRef, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import QRCode from "qrcode";
import { useQRCode } from "./QRCodeContext";

export const QRCodeDisplay = () => {
  const { settings, qrDataUrl, setQrDataUrl, getQrContent } = useQRCode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderQRCode = async () => {
    const content = getQrContent();

    if (!content || !canvasRef.current) return;

    try {
      const canvas = canvasRef.current;

      const options = {
        width: settings.size,
        margin: 1,
        color: {
          dark: settings.qrColor,
          light: settings.bgColor,
        },
        errorCorrectionLevel: settings.errorCorrectionLevel,
      };

      // Generate the basic QR code
      await QRCode.toCanvas(canvas, content, options);

      // Add frame if selected
      if (settings.frameStyle !== "none") {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const qrImage = canvas.toDataURL();
          const tempImg = document.createElement("img");

          tempImg.onload = () => {
            ctx.fillStyle = settings.bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const padding = settings.size * 0.1;
            const innerSize = settings.size - padding * 2;

            ctx.drawImage(tempImg, padding, padding, innerSize, innerSize);

            ctx.strokeStyle = settings.qrColor;
            ctx.lineWidth = 4;

            if (settings.frameStyle === "square") {
              ctx.strokeRect(
                padding / 2,
                padding / 2,
                settings.size - padding,
                settings.size - padding
              );
            } else if (settings.frameStyle === "rounded") {
              const radius = 15;
              ctx.beginPath();
              ctx.moveTo(padding / 2 + radius, padding / 2);
              ctx.lineTo(settings.size - padding / 2 - radius, padding / 2);
              ctx.arcTo(
                settings.size - padding / 2,
                padding / 2,
                settings.size - padding / 2,
                padding / 2 + radius,
                radius
              );
              ctx.lineTo(
                settings.size - padding / 2,
                settings.size - padding / 2 - radius
              );
              ctx.arcTo(
                settings.size - padding / 2,
                settings.size - padding / 2,
                settings.size - padding / 2 - radius,
                settings.size - padding / 2,
                radius
              );
              ctx.lineTo(padding / 2 + radius, settings.size - padding / 2);
              ctx.arcTo(
                padding / 2,
                settings.size - padding / 2,
                padding / 2,
                settings.size - padding / 2 - radius,
                radius
              );
              ctx.lineTo(padding / 2, padding / 2 + radius);
              ctx.arcTo(
                padding / 2,
                padding / 2,
                padding / 2 + radius,
                padding / 2,
                radius
              );
              ctx.stroke();
            } else if (settings.frameStyle === "dot") {
              // Draw dot pattern frame
              const dotSize = 4;
              const spacing = 8;

              // Top and bottom borders
              for (
                let x = padding / 2;
                x <= settings.size - padding / 2;
                x += spacing
              ) {
                ctx.beginPath();
                ctx.arc(x, padding / 2, dotSize, 0, Math.PI * 2);
                ctx.fill();

                ctx.beginPath();
                ctx.arc(
                  x,
                  settings.size - padding / 2,
                  dotSize,
                  0,
                  Math.PI * 2
                );
                ctx.fill();
              }

              // Left and right borders
              for (
                let y = padding / 2 + spacing;
                y < settings.size - padding / 2;
                y += spacing
              ) {
                ctx.beginPath();
                ctx.arc(padding / 2, y, dotSize, 0, Math.PI * 2);
                ctx.fill();

                ctx.beginPath();
                ctx.arc(
                  settings.size - padding / 2,
                  y,
                  dotSize,
                  0,
                  Math.PI * 2
                );
                ctx.fill();
              }
            } else if (settings.frameStyle === "circle") {
              ctx.beginPath();
              ctx.arc(
                settings.size / 2,
                settings.size / 2,
                (settings.size - padding) / 2,
                0,
                Math.PI * 2
              );
              ctx.stroke();
            }

            setQrDataUrl(canvas.toDataURL("image/png"));
          };

          tempImg.src = qrImage;
        }
      } else {
        setQrDataUrl(canvas.toDataURL("image/png"));
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.download = "qrcode_ZeroKit.png";
    link.href = qrDataUrl;
    link.click();
  };

  useEffect(() => {
    renderQRCode();
  }, [settings, getQrContent]);

  return (
    <Card className="bg-black/50 border-zinc-800">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Your QR Code</h3>

        <div className="flex flex-col items-center justify-center p-4">
          <div
            className="bg-white rounded-lg p-4 mb-4"
            style={{ backgroundColor: settings.bgColor }}>
            <canvas ref={canvasRef} />
          </div>

          <Button
            onClick={handleDownload}
            disabled={!qrDataUrl}
            className="bg-primary/80 hover:bg-primary">
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
