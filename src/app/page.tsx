import { redirect } from "next/navigation";
import { StyleTabs } from "@/data/enum";

export default function HomePage() {
	redirect(`/${StyleTabs.BoxShadow}`);
}
