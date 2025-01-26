import { notFound } from "next/navigation";
import { getCarDetails } from "@/app/actions/cars";
import { CarDetails } from "@/components/cars/car-details";

interface CarPageProps {
  params: {
    id: string;
  };
}

export default async function CarPage({ params }: CarPageProps) {
  const car = await getCarDetails(params.id);

  if (!car) {
    notFound();
  }

  return <CarDetails car={car} />;
}