import { staticRoutes } from "@/router/BrowserRouter";
import { Link } from "react-router-dom";

export const LearnMoreHelp = () => {
  return (
    <div className="absolute bottom-10 left-2/4 -translate-x-2/4">
      <h5 className="text-muted-foreground text-sm text-center">
        Learn more about Browxy Builder in the{" "}
        <Link
          to={`/${staticRoutes.BASE}/${staticRoutes.HELP}`}
          className="text-primary font-bold  hover:underline"
        >
          help
        </Link>{" "}
        section.
      </h5>
    </div>
  );
};
