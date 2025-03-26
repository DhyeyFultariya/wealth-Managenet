import HeroSection from "@/components/hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { featuresData, howItWorksData, statsData, testimonialsData } from "@/data/landing";
import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <div className="mt-28">
      <HeroSection />

      {/* Stats Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map( (statsData, index) => 
              (
                <div key={index} className="text-center">
                  <div className="font-bold text-4xl text-blue-600 mb-2">{statsData.value}</div>
                  <div className="text-gray-700">{statsData.label}</div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Everything you need in one place</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map( (feature, index) =>(
              <Card key={index} className="p-6">
                <CardContent className="space-y-4 pt-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
            </Card>
            
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-16 text-center">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksData.map( (step, index) =>(
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mt-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map( (testimonial, index) =>(
              <Card key={index} className="p-6">
                <CardContent className="pt-4">
                  <div className="flex items-center mb-4">
                    <Image 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      width={40} 
                      height={40} 
                      className="rounded-full"
                    />
                    <div className="ml-4">
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-600">{testimonial.quote}</p>
                </CardContent>
            </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-center text-white">
            Ready to take controle your Finances?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their finances smarter with welth
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 animate-bounce"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
