"use client";
import { useForm } from "react-hook-form";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  MessageCircle,
} from "lucide-react";

const UnifiedServiceForm = ({ variant = "default" }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [domain, setDomain] = useState("");
  const [source, setSource] = useState("homepage");
  const form = useRef();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDomain(window.location.hostname);
      const path = window.location.pathname;
      if (path.startsWith("/contact")) setSource("contact");
      else if (path.startsWith("/aquatic-specialists-gold-coast")) setSource("gold-coast");
      else if (path.startsWith("/service")) setSource("service");
      else setSource("homepage");
    }
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    try {
      const emailjsModule = await import("@emailjs/browser");
      const result = await emailjsModule.default.sendForm(
        "service_nyo9717",
        "template_lqh6rse",
        form.current,
        "PlnxkEthyMpuKG_kJ"
      );

      if (result.text === "OK") {
        setSubmitStatus({
          type: "success",
          message:
            "Thank you! Brisbane's #1 aquarium experts will contact you as soon as possible.",
        });
        try {
          await fetch("/api/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: data.name,
              email: data.email,
              phone: data.phone,
              location: data.location,
              service: data.service,
              message: data.message || null,
              source,
            }),
          });
        } catch (dbErr) {
          console.error("Lead DB save failed:", dbErr);
        }
        reset();
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          "Something went wrong. Please call us directly at (04) 5766 3939 for immediate assistance.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardStyles = {
    default:
      "bg-cream/5 backdrop-blur-md border border-cream/15 rounded-2xl hover:bg-cream/10 hover:border-amber-glow/50 transition-all duration-300",
    contact:
      "bg-cream/10 backdrop-blur-lg border border-cream/15 rounded-2xl text-cream shadow-2xl hover:border-amber-glow/50 transition-all duration-300",
  };

  const titleConfig = {
    default: "Get a Free Quote",
    contact: "Send Us a Message",
  };

  const buttonConfig = {
    default: {
      text: "Get Free Quote",
      loadingText: "Sending...",
      style:
        "bg-amber-glow text-[#04121b] rounded-full text-[13px] uppercase tracking-[0.14em] font-medium border-none hover:bg-amber-glow hover:shadow-[0_6px_30px_rgba(232,160,92,0.35)]",
    },
    contact: {
      text: "Send Message",
      loadingText: "Sending Message...",
      style:
        "bg-amber-glow text-[#04121b] rounded-full text-[13px] uppercase tracking-[0.14em] font-medium border-none hover:bg-amber-glow hover:shadow-[0_6px_30px_rgba(232,160,92,0.35)]",
    },
  };

  const buttonConfig_ = buttonConfig[variant] || buttonConfig.default;

  return (
    <Card className={cardStyles[variant] || cardStyles.default}>
      <CardHeader>
        <CardTitle className="font-display text-2xl font-medium text-parchment flex items-center gap-2">
          {variant === "contact" && (
            <MessageCircle className="w-8 h-8 text-amber-glow" />
          )}
          {titleConfig[variant] || titleConfig.default}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={form} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-cream/80">
              Your Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              className="bg-abyss/40 border-cream/20 text-cream placeholder:text-cream/40 focus:border-amber-glow focus:ring-amber-glow/40 focus-visible:ring-amber-glow/40"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <p className="text-red-300 text-sm mt-1">
                Please enter your name
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-cream/80">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              className="bg-abyss/40 border-cream/20 text-cream placeholder:text-cream/40 focus:border-amber-glow focus:ring-amber-glow/40 focus-visible:ring-amber-glow/40"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-1">
                Please enter a valid email
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="text-cream/80">
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(04) 1234 5678"
              className="bg-abyss/40 border-cream/20 text-cream placeholder:text-cream/40 focus:border-amber-glow focus:ring-amber-glow/40 focus-visible:ring-amber-glow/40"
              {...register("phone", { required: true })}
            />
            {errors.phone && (
              <p className="text-red-300 text-sm mt-1">
                Please enter your phone number
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="location" className="text-cream/80">
              Location
            </Label>
            <Input
              id="location"
              name="location"
              type="text"
              placeholder="e.g. Southside Brisbane, CBD, Gold Coast"
              className="bg-abyss/40 border-cream/20 text-cream placeholder:text-cream/40 focus:border-amber-glow focus:ring-amber-glow/40 focus-visible:ring-amber-glow/40"
              {...register("location", { required: true })}
            />
            {errors.location && (
              <p className="text-red-300 text-sm mt-1">
                Please enter your location
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="service" className="text-cream/80">
              Service Type
            </Label>
            <Select
              onValueChange={(value) => setValue("service", value)}
              defaultValue=""
            >
              <SelectTrigger
                className="bg-abyss/40 border-cream/20 text-cream focus:border-amber-glow focus:ring-amber-glow/40"
                aria-label="Select service type"
              >
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tank Cleaning/Maintenance">
                  Fish Tank Cleaning/Maintenance
                </SelectItem>
                <SelectItem value="Pond Cleaning">
                  Pond Cleaning
                </SelectItem>
                <SelectItem value="Tank Setup">
                  New Tank Setup
                </SelectItem>
                <SelectItem value="Pond Setup">
                  New Pond Setup
                </SelectItem>
                <SelectItem value="Tank Removal">
                  Tank Removal
                </SelectItem>
                <SelectItem value="Consultation">
                  Consultation
                </SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <input
              type="hidden"
              name="service"
              {...register("service", { required: true })}
            />
            {errors.service && (
              <p className="text-red-300 text-sm mt-1">
                Please select a service
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="message" className="text-cream/80">
              Additional Details
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about your aquarium..."
              className="bg-abyss/40 border-cream/20 text-cream placeholder:text-cream/40 focus:border-amber-glow focus:ring-amber-glow/40 focus-visible:ring-amber-glow/40 min-h-[100px]"
              {...register("message")}
            />
          </div>

          <input type="hidden" name="domain" value={domain} />

          <Button
            type="submit"
            className={`w-full ${buttonConfig_.style} py-6`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {buttonConfig_.loadingText}
              </>
            ) : (
              buttonConfig_.text
            )}
          </Button>

          {submitStatus.type && (
            <div
              className={`p-4 rounded-2xl ${
                submitStatus.type === "success"
                  ? "bg-green-950/30 border border-green-800/40"
                  : "bg-red-950/30 border border-red-800/40"
              }`}
            >
              <div className="flex items-center gap-2">
                {submitStatus.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-300" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-300" />
                )}
                <p
                  className={`text-sm font-medium ${
                    submitStatus.type === "success"
                      ? "text-green-300"
                      : "text-red-300"
                  }`}
                >
                  {submitStatus.message}
                </p>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default UnifiedServiceForm;
