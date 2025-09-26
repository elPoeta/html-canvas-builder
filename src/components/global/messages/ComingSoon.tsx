import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

import { staticRoutes } from "@/router/BrowserRouter";
import { Rocket } from "lucide-react";
import { Link } from "react-router-dom";

export const ComingSoon = () => {
  return (
    <div className="h-screen flex items-center justify-center ">
      <Card className="w-full max-w-lg p-8 bg-white shadow-xl rounded-xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold mb-4 text-primary">
            Coming Soon
          </h1>
          <h4 className="text-lg text-gray-700 mb-6">
            We are working hard to bring you something amazing. Get ready for
            the launch!
          </h4>
          <Rocket className="w-20 h-20 mx-auto mb-4 stroke-primary" />
          <Button
            variant="outline"
            className="w-full max-w-xs mx-auto text-lg "
          >
            <Link to={`/${staticRoutes.BASE}/${staticRoutes.DASHBOARD}`}>
              Dashboard
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};
