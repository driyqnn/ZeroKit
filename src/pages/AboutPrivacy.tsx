import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Shield,
  Lock,
  Eye,
  Check,
  AlertTriangle,
  Server,
  History,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const AboutPrivacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background animate-fade-in">
      <Header />

      <main className="flex-grow container max-w-screen-2xl mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">About Privacy</h1>
          </div>

          <p className="text-lg text-muted-foreground mb-8">
            ZeroKit was built with privacy as the foundation of its design.
            Here's how we protect your data and respect your privacy.
          </p>

          <Separator className="my-8" />

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">
                  Browser-Only Processing
                </h2>
              </div>
              <p className="text-muted-foreground">
                All ZeroKit tools run entirely in your browser. Your files,
                text, and other data never leave your device. Processing happens
                locally using your browser's capabilities, not on remote
                servers.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">No Data Collection</h2>
              </div>
              <p className="text-muted-foreground">
                We don't track your usage, store your files, or collect personal
                information. There are no cookies for tracking, no user accounts
                to manage, and no need to worry about data leaks.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Exceptions</h2>
              </div>
              <p className="text-muted-foreground">
                Some tools may offer optional sharing features or integrations.
                In these cases, data is only transmitted when you explicitly
                choose to share or export. We clearly indicate when this happens
                and what data will be shared.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Server className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">
                  Free and Open for Everyone
                </h2>
              </div>
              <p className="text-muted-foreground">
                ZeroKit is free and open for everyone. We don't charge anyone
                for using our tools and we welcome community contributions to
                improve our privacy and security.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <History className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Data Persistence</h2>
              </div>
              <p className="text-muted-foreground">
                For convenience, some tools may store your preferences or recent
                work in your browser's local storage. This data remains on your
                device and you can clear it at any time through your browser
                settings.
              </p>
            </section>
          </div>

          <Separator className="my-8" />

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mt-8">
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-medium mb-2">Our Privacy Commitment</h3>
                <p className="text-sm text-muted-foreground">
                  We built ZeroKit because we believe privacy shouldn't be a
                  premium feature. Our tools will always prioritize your
                  privacy, and we will continually work to improve our security
                  practices as technology evolves.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPrivacy;
