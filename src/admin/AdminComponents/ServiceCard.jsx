import { Heart, Shield, Clock, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useDeleteServiceMutation } from "../../app/api/serviceApiSlice";

export default function ServiceCard({
  imageSrc,
  alt = "",
  demandLevel,
  serviceName,
  verificationCount,
  durationDays,
  price,
  serviceId, // This is the service_key, used for navigation
  serviceDbId, // This is the database _id, used for mutations
  onUpdateClick, // Function to call when update is clicked
}) {
  const navigate = useNavigate();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const handleDeleteService = async (e) => {
    // Prevent the click from navigating
    e.stopPropagation(); 
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      // Use the database _id for the delete mutation for consistency with caching
      await deleteService(serviceId).unwrap();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete service. Please try again.");
    }
  };
  
  const handleUpdate = (e) => {
    // Prevent the click from navigating
    e.stopPropagation();
    // Notify the parent component to open the update form
    onUpdateClick();
  };

  return (
    <Card onClick={() => navigate(`/user/service/${serviceId}`)} className="overflow-hidden border border-[#1A89C1] p-1 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out hover:-translate-y-2">
      <div className="relative">
        <div className="aspect-[4/2.8] overflow-hidden">
          <img
            src={imageSrc}
            alt={alt || serviceName}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-md">
            {demandLevel}
          </Badge>
          <button className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
          </button>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {serviceName}
        </h3>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-blue-500" />
            <span>{verificationCount} Verifications</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{durationDays} days</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 ">
          <div className="text-xl font-bold text-orange-500">₹ {price}</div>
          <div className="flex items-center space-x-2">
            {/* UPDATE BUTTON */}
            <Button
              size="icon"
              variant="outline"
              onClick={handleUpdate}
              className="w-8 h-8 text-blue-600 border-gray-300 hover:bg-blue-50"
              aria-label="Update service"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            {/* DELETE BUTTON */}
            <Button
              size="icon"
              variant="outline"
              disabled={isDeleting}
              onClick={handleDeleteService}
              className="w-8 h-8 text-red-600 border-gray-300 hover:bg-red-50 disabled:opacity-50"
              aria-label="Delete service"
            >
              {isDeleting ? "..." : <Trash2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}