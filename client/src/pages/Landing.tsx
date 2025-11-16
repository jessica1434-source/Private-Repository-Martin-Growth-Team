import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Heart, BarChart3 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function Landing() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Users,
      title: t('children_growth_tracking'),
      description: t('track_height_weight_monthly'),
    },
    {
      icon: TrendingUp,
      title: t('growth_trends_analysis'),
      description: t('visualize_growth_trends'),
    },
    {
      icon: Heart,
      title: t('compliance_monitoring'),
      description: t('monitor_service_compliance'),
    },
    {
      icon: BarChart3,
      title: t('performance_analytics'),
      description: t('detailed_performance_metrics'),
    },
  ];

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t('children_growth_management_system')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('professional_growth_tracking_platform')}
          </p>
          <Button 
            size="lg" 
            onClick={handleLogin}
            data-testid="button-login"
            className="text-lg px-8 py-6"
          >
            {t('login_to_system')}
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover-elevate transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Role Information */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">{t('role_based_access')}</CardTitle>
            <CardDescription>{t('role_based_access_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">{t('boss_manager_role')}</h3>
              <p className="text-sm text-muted-foreground">{t('boss_role_description')}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">{t('supervisor_role')}</h3>
              <p className="text-sm text-muted-foreground">{t('supervisor_role_description')}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">{t('manager_role')}</h3>
              <p className="text-sm text-muted-foreground">{t('manager_role_description')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
