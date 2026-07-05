"use client";

import { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function CheckoutForm({
  clientSecret,
  total,
  onPaymentSuccess,
  orderNumber,
  customerInfo,
  shippingAddress,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState({
    address: "",
    suburb: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Australia",
  });

  // Auto-fill billing address when "same as shipping" is checked
  useEffect(() => {
    if (sameAsShipping && shippingAddress) {
      setBillingAddress({
        address: shippingAddress.address || "",
        suburb: shippingAddress.suburb || "",
        city: shippingAddress.city || "",
        state: shippingAddress.state || "",
        zipCode: shippingAddress.zipCode || "",
        country: "Australia", // Always Australia
      });
    }
  }, [sameAsShipping, shippingAddress]);

  const handleSameAsShippingChange = (checked) => {
    setSameAsShipping(checked);
    if (checked && shippingAddress) {
      setBillingAddress({
        address: shippingAddress.address || "",
        suburb: shippingAddress.suburb || "",
        city: shippingAddress.city || "",
        state: shippingAddress.state || "",
        zipCode: shippingAddress.zipCode || "",
        country: "Australia", // Always Australia
      });
    } else if (!checked) {
      setBillingAddress({
        address: "",
        suburb: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Australia", // Always Australia
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${
            window.location.origin
          }/products/checkout?payment_intent=${
            clientSecret.split("_secret_")[0]
          }`,
          receipt_email: customerInfo.email,
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message);
        console.error("Payment failed:", error);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
        onPaymentSuccess(paymentIntent, billingAddress);
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
      console.error("Payment error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center font-display font-medium text-parchment">
          <CreditCard className="w-5 h-5 mr-2" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Billing Address */}
          <div>
            <h3 className="font-display text-lg font-medium text-parchment mb-3">Billing Address</h3>

            {/* Same as Shipping Checkbox */}
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="sameAsShipping"
                checked={sameAsShipping}
                onChange={(e) => handleSameAsShippingChange(e.target.checked)}
                className="h-4 w-4 accent-amber-glow focus:ring-amber-glow/40 border-cream/30 rounded"
              />
              <Label
                htmlFor="sameAsShipping"
                className="text-sm font-medium text-cream/80"
              >
                Same as shipping address
              </Label>
            </div>

            {/* Billing Address Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="billingAddress">Address</Label>
                <Input
                  id="billingAddress"
                  required
                  value={billingAddress.address}
                  onChange={(e) =>
                    setBillingAddress({
                      ...billingAddress,
                      address: e.target.value,
                    })
                  }
                  disabled={sameAsShipping}
                  placeholder="Enter billing address"
                  className={sameAsShipping ? "bg-cream/10" : ""}
                />
              </div>

              <div>
                <Label htmlFor="billingSuburb">Suburb</Label>
                <Input
                  id="billingSuburb"
                  required
                  value={billingAddress.suburb}
                  onChange={(e) =>
                    setBillingAddress({
                      ...billingAddress,
                      suburb: e.target.value,
                    })
                  }
                  disabled={sameAsShipping}
                  placeholder="Enter suburb"
                  className={sameAsShipping ? "bg-cream/10" : ""}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="billingCity">City</Label>
                  <Input
                    id="billingCity"
                    required
                    value={billingAddress.city}
                    onChange={(e) =>
                      setBillingAddress({
                        ...billingAddress,
                        city: e.target.value,
                      })
                    }
                    disabled={sameAsShipping}
                    placeholder="City"
                    className={sameAsShipping ? "bg-cream/10" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="billingState">State</Label>
                  <Input
                    id="billingState"
                    required
                    value={billingAddress.state}
                    onChange={(e) =>
                      setBillingAddress({
                        ...billingAddress,
                        state: e.target.value,
                      })
                    }
                    disabled={sameAsShipping}
                    placeholder="State"
                    className={sameAsShipping ? "bg-cream/10" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="billingZipCode">Postcode</Label>
                  <Input
                    id="billingZipCode"
                    required
                    value={billingAddress.zipCode}
                    onChange={(e) =>
                      setBillingAddress({
                        ...billingAddress,
                        zipCode: e.target.value,
                      })
                    }
                    disabled={sameAsShipping}
                    placeholder="Postcode"
                    className={sameAsShipping ? "bg-cream/10" : ""}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="billingCountry">Country</Label>
                <Select value="Australia" disabled={true}>
                  <SelectTrigger 
                    className="bg-cream/10"
                    aria-label="Select country"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Payment Element for card details */}
          <div>
            <h3 className="font-display text-lg font-medium text-parchment mb-3">Payment Details</h3>
            <PaymentElement
              options={{
                layout: "tabs",
              }}
            />
          </div>

          {/* Order Summary */}
          <div className="bg-cream/5 border border-cream/15 p-4 rounded-2xl">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span className="text-amber-glow">${total.toFixed(2)} AUD</span>
            </div>
            <p className="text-sm text-cream/60 mt-1">Order #{orderNumber}</p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 rounded-full font-medium uppercase tracking-[0.14em] text-[13px] hover:shadow-[0_6px_30px_rgba(232,160,92,0.35)]"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Pay ${total.toFixed(2)} AUD
              </>
            )}
          </Button>

          <p className="text-xs text-cream/50 text-center">
            Your payment information is secured with 256-bit SSL encryption.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
