import {
  BookOpen,
  CheckSquare,
  Grid,
  Heart,
  List,
  Map,
  PieChart,
  Sliders,
  Users,
  Settings
} from "react-feather";

const pagesSection = [
  {
    href: "/dashboard",
    icon: Sliders,
    title: "Dashboard",
  },
  {
    href: "/dashboard/subjects",
    icon: BookOpen,
    title: "Materias",
  },
  {
    href: "/dashboard/questions",
    icon: CheckSquare,
    title: "Cuestionarios",
  },
  {
    href: "/dashboard/users",
    icon: Users,
    title: "Usuarios",
  },
  {
    href: "/dashboard/landing",
    icon: Settings,
    title: "Langing Page",
  }
];

const docsSection = [
  {
    href: "/documentation/welcome",
    icon: BookOpen,
    title: "Documentation",
  },
  {
    href: "/changelog",
    icon: List,
    title: "Changelog",
    badge: "v4.3.0",
  },
];

const navItems = [
  {
    title: "APP",
    pages: pagesSection,
  },
];

export default navItems;
