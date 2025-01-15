import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function getsalesData() {}

export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard title="title" subtitle="subtitle" body="body" />
      <DashboardCard title="title" subtitle="subtitle" body="body" />
    </div>
  );
}
type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}
