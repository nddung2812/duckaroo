import { Badge } from "@/components/ui/badge";
import UnifiedServiceForm from "../../components/UnifiedServiceForm";

const ServiceBanner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Content Section */}
        <div className="text-white space-y-6">
          <Badge
            variant="outline"
            className="bg-white/10 border-white/20 text-white mb-4"
          >
            Professional Aquatic Services
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Professional
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 block">
              Fish Tank Cleaning Service
            </span>
            <span className="text-2xl md:text-3xl lg:text-4xl font-normal text-white/80 block mt-2">
              Across Brisbane Areas
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
            Looking for a reliable{" "}
            <span className="text-emerald-400 font-semibold">
              fish tank cleaning service
            </span>{" "}
            in <span className="text-emerald-400 font-semibold">Brisbane</span>?
            Whether you need aquarium maintenance, pond cleaning, new tank
            setups, equipment installations, or aquarium relocations across
            Brisbane areas,{" "}
            <span className="text-emerald-400 font-semibold">Duckaroo</span>{" "}
            provides professional fish tank cleaning service solutions tailored
            to your needs!
          </p>

          {/* Callout Fee Notice */}
          <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-lg p-4 max-w-2xl">
            <p className="text-emerald-200 font-semibold text-lg">
              💰 Service Callout Fee: $70
            </p>
            <p className="text-white/80 text-sm mt-1">
              Professional fish tank cleaning service callout fee applies to all
              Brisbane locations. Fee includes travel time, initial assessment,
              and service consultation.
            </p>
          </div>

          {/* Service Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-white/90">
                Professional Fish Tank Cleaning
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-white/90">Brisbane-Wide Service</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-white/90">Same-Day Fish Tank Service</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-white/90">Maintenance Plans Available</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:pl-8 mt-16">
          <UnifiedServiceForm />
        </div>
      </div>
    </div>
  );
};

export default ServiceBanner;
