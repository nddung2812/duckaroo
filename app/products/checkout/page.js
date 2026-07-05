"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Truck, Mail, Loader2, AlertTriangle } from "lucide-react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import CheckoutForm from "./CheckoutForm";
import PageAmbience from "../../components/PageAmbience";
import { getBuyerAwareWarning } from "@/lib/buyerAware";

// Validate Stripe publishable key
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  console.error(
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable is not set"
  );
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function CheckoutPageContent() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [paymentStep, setPaymentStep] = useState("details"); // "details" or "payment"
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form state
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    suburb: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Australia",
  });

  const [billingAddress, setBillingAddress] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Australia",
    sameAsShipping: true,
  });

  const [shippingOption, setShippingOption] = useState("standard");

  // Load cart from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("shopping-cart");
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
          if (parsedCart.length === 0) {
            router.push("/products");
          }
        } catch (error) {
          // Handle parsing errors silently and redirect
          router.push("/products");
        }
      } else {
        router.push("/products");
      }
    }
  }, [router]);

  const formatPrice = (price) => {
    return (
      new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
      }).format(price) + " AUD"
    );
  };

  const getSubtotal = useCallback(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const getShippingCost = useCallback(() => {
    return 15.0; // Standard shipping only
  }, []);

  const getTotal = useCallback(() => {
    return getSubtotal() + getShippingCost();
  }, [getSubtotal, getShippingCost]);

  const generateOrderNumber = () => {
    return "AQ" + Date.now().toString().slice(-8);
  };

  const formatAddress = (address) => {
    const parts = [address.address];

    // Add suburb if it exists
    if (address.suburb) {
      parts.push(address.suburb);
    }

    // Add city only if it's different from suburb
    if (
      address.city &&
      address.city.toLowerCase() !== address.suburb?.toLowerCase()
    ) {
      parts.push(address.city);
    }

    // Add state and zipCode
    if (address.state && address.zipCode) {
      parts.push(`${address.state} ${address.zipCode}`);
    }

    return parts.join(", ");
  };

  const sendConfirmationEmail = useCallback(
    async (orderDetails) => {
      try {
        const templateParams = {
          to_email: customerInfo.email,
          customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          order_number: orderDetails.orderNumber,
          order_total: formatPrice(orderDetails.total),
          items: cartItems
            .map(
              (item) =>
                `${item.name} (Qty: ${item.quantity}) - ${formatPrice(
                  item.price * item.quantity
                )}`
            )
            .join("\n"),
          shipping_address: formatAddress(shippingAddress),
          billing_address: orderDetails.billingAddress
            ? formatAddress(orderDetails.billingAddress)
            : "Same as shipping address",
          shipping_method: "Standard Shipping (5-7 days) - $15.00",
        };

        // Send confirmation email using EmailJS
        await emailjs.send(
          "service_nyo9717", // EmailJS service ID
          "template_0xpbklp", // EmailJS template ID for order confirmation
          templateParams,
          "PlnxkEthyMpuKG_kJ" // EmailJS public key
        );
      } catch (error) {
        console.error("Failed to send confirmation email:", error);
      }
    },
    [customerInfo, cartItems, shippingAddress]
  );

  const createPaymentIntent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: getTotal(),
          currency: "aud",
          metadata: {
            orderNumber: generateOrderNumber(),
            customerEmail: customerInfo.email,
            customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
            shippingAddress: JSON.stringify(shippingAddress),
            items: JSON.stringify(
              cartItems.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              }))
            ),
          },
          shipping: {
            name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            phone: customerInfo.phone,
            address: {
              line1: shippingAddress.address,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.zipCode,
              country:
                shippingAddress.country === "Australia"
                  ? "AU"
                  : shippingAddress.country,
            },
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setOrderNumber(data.metadata?.orderNumber || generateOrderNumber());
        setPaymentStep("payment");
      } else {
        throw new Error(data.error || "Failed to create payment intent");
      }
    } catch (error) {
      console.error("Payment intent creation failed:", error);
      toast.error(
        `Failed to initialize payment: ${error.message || "Please try again."}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = useCallback(
    async (paymentIntent, billingAddressData = null) => {
      try {
        // Send confirmation email
        await sendConfirmationEmail({
          orderNumber: orderNumber,
          total: getTotal(),
          paymentId: paymentIntent.id,
          billingAddress: billingAddressData,
        });

        // Save order to database (fire-and-forget)
        fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_number: orderNumber,
            stripe_payment_id: paymentIntent.id,
            customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            customer_email: customerInfo.email,
            customer_phone: customerInfo.phone,
            shipping_address: shippingAddress,
            billing_address: billingAddressData || (billingAddress.sameAsShipping ? shippingAddress : billingAddress),
            items: cartItems.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
            subtotal: getSubtotal(),
            shipping: getShippingCost(),
            total: getTotal(),
            currency: "AUD",
          }),
        }).catch((err) => console.error("Failed to save order:", err));

        // Clear cart
        if (typeof window !== "undefined") {
          localStorage.removeItem("shopping-cart");
        }
        setOrderComplete(true);
        toast.success("Payment successful! Confirmation email sent.");
      } catch (error) {
        console.error("Post-payment processing failed:", error);
        toast.warning(
          "Payment successful, but confirmation email failed to send."
        );
        setOrderComplete(true);
      }
    },
    [orderNumber, getTotal, getSubtotal, getShippingCost, sendConfirmationEmail, customerInfo, shippingAddress, billingAddress, cartItems]
  );

  const handlePaymentReturn = useCallback(
    async (paymentIntentId) => {
      try {
        const response = await fetch("/api/confirm-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentIntentId }),
        });

        const data = await response.json();
        if (data.status === "succeeded") {
          await handlePaymentSuccess(data.paymentIntent);
        }
      } catch (error) {
        console.error("Error confirming payment:", error);
      }
    },
    [handlePaymentSuccess]
  );

  // Check for payment intent in URL (for return from redirect)
  useEffect(() => {
    const paymentIntent = searchParams.get("payment_intent");
    if (paymentIntent) {
      // Handle successful payment return
      handlePaymentReturn(paymentIntent);
    }
  }, [searchParams, handlePaymentReturn]);

  const handleDetailsSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !customerInfo.firstName ||
      !customerInfo.lastName ||
      !customerInfo.email
    ) {
      toast.error("Please fill in all required customer information fields.");
      return;
    }
    if (
      !shippingAddress.address ||
      !shippingAddress.suburb ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode
    ) {
      toast.error("Please fill in all required shipping address fields.");
      return;
    }

    // Generate order number and create payment intent
    const newOrderNumber = generateOrderNumber();
    setOrderNumber(newOrderNumber);
    createPaymentIntent();
  };

  if (orderComplete) {
    return (
      <>
        <PageAmbience />
        <div className="min-h-screen relative z-10 py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="text-center bg-cream/5 backdrop-blur-md border-cream/15 rounded-2xl text-cream">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-950/30 border border-green-800/40 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-green-300" />
                </div>
                <h1 className="font-display text-3xl font-medium text-parchment mb-4">
                  Order Confirmed!
                </h1>
                <p className="text-cream/70 mb-4">
                  Thank you for your purchase. Your order #{orderNumber} has been
                  confirmed.
                </p>
                <p className="text-cream/70 mb-8">
                  A confirmation email has been sent to {customerInfo.email}
                </p>
                <div className="space-y-4">
                  <Button
                    onClick={() => router.push("/products")}
                    className="w-full bg-amber-glow text-[#04121b] rounded-full text-[13px] uppercase tracking-[0.14em] font-medium hover:bg-amber-glow hover:shadow-[0_6px_30px_rgba(232,160,92,0.35)]"
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/")}
                    className="w-full rounded-full bg-transparent border-cream/30 text-cream/90 hover:border-cream/60 hover:bg-cream/5 hover:text-cream text-[13px] uppercase tracking-[0.14em]"
                  >
                    Return to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
    <PageAmbience />
    <div className="min-h-screen relative z-10 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/products")}
            className="mb-4 flex items-center gap-2 rounded-full bg-transparent border-cream/30 text-cream/90 hover:border-cream/60 hover:bg-cream/5 hover:text-cream text-[13px] uppercase tracking-[0.14em]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Button>
          <h1 className="font-display text-3xl font-medium text-parchment">Checkout</h1>
        </div>

        {paymentStep === "details" ? (
          <form onSubmit={handleDetailsSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Forms */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Information */}
                <Card className="bg-cream/5 backdrop-blur-md border-cream/15 rounded-2xl text-cream">
                  <CardHeader>
                    <CardTitle className="font-display font-medium text-parchment">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-cream/80">First Name</Label>
                        <Input
                          id="firstName"
                          required
                          className="bg-abyss/40 border-cream/20 text-cream placeholder:text-cream/40 focus-visible:border-amber-glow focus-visible:ring-amber-glow/40"
                          value={customerInfo.firstName}
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-cream/80">Last Name</Label>
                        <Input
                          id="lastName"
                          required
                          className="bg-abyss/40 border-cream/20 text-cream placeholder:text-cream/40 focus-visible:border-amber-glow focus-visible:ring-amber-glow/40"
                          value={customerInfo.lastName}
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-cream/80">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        className="bg-abyss/40 border-cream/20 text-cream placeholder:text-cream/40 focus-visible:border-amber-glow focus-visible:ring-amber-glow/40"
                        value={customerInfo.email}
                        onChange={(e) =>
                          setCustomerInfo({
                            ...customerInfo,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-cream/80">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        className="bg-abyss/40 border-cream/20 text-cream placeholder:text-cream/40 focus-visible:border-amber-glow focus-visible:ring-amber-glow/40"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          setCustomerInfo({
                            ...customerInfo,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card className="bg-cream/5 backdrop-blur-md border-cream/15 rounded-2xl text-cream">
                  <CardHeader>
                    <CardTitle className="flex items-center font-display font-medium text-parchment">
                      <Truck className="w-5 h-5 mr-2" />
                      Shipping Address
                      <span
                        className="hidden sm:inline-block ml-2 text-red-300 text-sm cursor-help relative group"
                        title="Shipping to WA, NT and TAS is not available due to regulations."
                      >
                        *
                        <div className="absolute left-full ml-2 top-0 transform-none text-red-300 text-sm font-light opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                          Shipping to WA, NT and TAS is not available due to
                          regulations.
                        </div>
                      </span>
                    </CardTitle>
                    <div className="sm:hidden mt-2">
                      <span
                        className="text-red-300 text-xs font-light"
                        title="Shipping to WA, NT and TAS is not available due to regulations."
                      >
                        * Shipping to WA, NT and TAS is not available due to
                        regulations.
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address" className="text-cream/80">Address</Label>
                      <Input
                        id="address"
                        required
                        className="bg-abyss/40 border-cream/20 text-cream placeholder:text-cream/40 focus-visible:border-amber-glow focus-visible:ring-amber-glow/40"
                        value={shippingAddress.address}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            address: e.target.value,
                          })
                        }
                        placeholder="Enter your full address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="suburb" className="text-cream/80">Suburb</Label>
                      <Input
                        id="suburb"
                        required
                        className="bg-abyss/40 border-cream/20 text-cream placeholder:text-cream/40 focus-visible:border-amber-glow focus-visible:ring-amber-glow/40"
                        value={shippingAddress.suburb}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            suburb: e.target.value,
                          })
                        }
                        placeholder="Enter suburb"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-cream/80">City</Label>
                        <Input
                          id="city"
                          required
                          className="bg-abyss/40 border-cream/20 text-cream placeholder:text-cream/40 focus-visible:border-amber-glow focus-visible:ring-amber-glow/40"
                          value={shippingAddress.city}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              city: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-cream/80">State</Label>
                        <Input
                          id="state"
                          required
                          className="bg-abyss/40 border-cream/20 text-cream placeholder:text-cream/40 focus-visible:border-amber-glow focus-visible:ring-amber-glow/40"
                          value={shippingAddress.state}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              state: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode" className="text-cream/80">Postcode</Label>
                        <Input
                          id="zipCode"
                          required
                          className="bg-abyss/40 border-cream/20 text-cream placeholder:text-cream/40 focus-visible:border-amber-glow focus-visible:ring-amber-glow/40"
                          value={shippingAddress.zipCode}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              zipCode: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Options */}
                <Card className="bg-cream/5 backdrop-blur-md border-cream/15 rounded-2xl text-cream">
                  <CardHeader>
                    <CardTitle className="font-display font-medium text-parchment">Shipping Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={shippingOption}
                      onValueChange={setShippingOption}
                    >
                      <SelectTrigger
                        aria-label="Select shipping option"
                        className="bg-abyss/40 border-cream/20 text-cream focus:border-amber-glow focus:ring-amber-glow/40"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-ink border-cream/15 text-cream">
                        <SelectItem value="standard">
                          Standard Shipping (5-7 days) - $15.00
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Continue to Payment Button */}
                <Card className="bg-cream/5 backdrop-blur-md border-cream/15 rounded-2xl text-cream">
                  <CardHeader>
                    <CardTitle className="flex items-center font-display font-medium text-parchment">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Review & Continue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-cream/70 mb-4">
                      Please review your order details and shipping information
                      above, then proceed to payment.
                    </p>
                    <Button
                      type="submit"
                      className="w-full bg-amber-glow text-[#04121b] rounded-full text-[13px] uppercase tracking-[0.14em] font-medium hover:bg-amber-glow hover:shadow-[0_6px_30px_rgba(232,160,92,0.35)]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Setting up payment...
                        </>
                      ) : (
                        "Continue to Payment"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4 bg-cream/5 backdrop-blur-md border-cream/15 rounded-2xl text-cream">
                  <CardHeader>
                    <CardTitle className="font-display font-medium text-parchment">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Items */}
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-start"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-cream/90">
                              {item.name}
                            </h4>
                            <p className="text-xs text-cream/60 font-medium">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Buyer Aware notices */}
                    {cartItems
                      .map((item) => ({ item, warning: getBuyerAwareWarning(item) }))
                      .filter(({ warning }) => warning)
                      .map(({ item, warning }) => (
                        <div
                          key={`ba-${item.id}`}
                          role="alert"
                          className="flex items-start gap-2 rounded-2xl border border-amber-glow/40 bg-moss/40 p-3 text-xs text-cream/80"
                        >
                          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-glow" />
                          <div>
                            <p className="font-semibold mb-0.5 text-amber-glow">
                              {warning.title} — {item.name}
                            </p>
                            <p className="leading-relaxed">{warning.fullMessage}</p>
                          </div>
                        </div>
                      ))}

                    <Separator className="bg-cream/15" />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatPrice(getSubtotal())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>{formatPrice(getShippingCost())}</span>
                      </div>
                      <Separator className="bg-cream/15" />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-amber-glow">
                          {formatPrice(getTotal())}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Step with Stripe Elements */}
            {/* Left Column - Payment Form */}
            <div className="lg:col-span-2">
              {clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "night",
                      variables: {
                        colorPrimary: "#e8a05c",
                        colorBackground: "#0a2114",
                        colorText: "#ede9db",
                        colorDanger: "#fca5a5",
                        borderRadius: "10px",
                      },
                    },
                  }}
                >
                  <CheckoutForm
                    clientSecret={clientSecret}
                    total={getTotal()}
                    onPaymentSuccess={handlePaymentSuccess}
                    orderNumber={orderNumber}
                    customerInfo={customerInfo}
                    shippingAddress={shippingAddress}
                  />
                </Elements>
              )}

              <Button
                onClick={() => setPaymentStep("details")}
                variant="outline"
                className="mt-4 rounded-full bg-transparent border-cream/30 text-cream/90 hover:border-cream/60 hover:bg-cream/5 hover:text-cream text-[13px] uppercase tracking-[0.14em]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Details
              </Button>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 bg-cream/5 backdrop-blur-md border-cream/15 rounded-2xl text-cream">
                <CardHeader>
                  <CardTitle className="font-display font-medium text-parchment">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-sm text-cream/60">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Buyer Aware notices */}
                  {cartItems
                    .map((item) => ({ item, warning: getBuyerAwareWarning(item) }))
                    .filter(({ warning }) => warning)
                    .map(({ item, warning }) => (
                      <div
                        key={`ba-${item.id}`}
                        role="alert"
                        className="flex items-start gap-2 rounded-2xl border border-amber-glow/40 bg-moss/40 p-3 text-xs text-cream/80"
                      >
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-glow" />
                        <div>
                          <p className="font-semibold mb-0.5 text-amber-glow">
                            {warning.title} — {item.name}
                          </p>
                          <p className="leading-relaxed">{warning.fullMessage}</p>
                        </div>
                      </div>
                    ))}

                  <Separator className="bg-cream/15" />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(getSubtotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{formatPrice(getShippingCost())}</span>
                    </div>
                    <Separator className="bg-cream/15" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-amber-glow">
                        {formatPrice(getTotal())}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <>
          <PageAmbience />
          <div className="min-h-screen relative z-10 py-12 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-cream/80">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span>Loading checkout...</span>
            </div>
          </div>
        </>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
