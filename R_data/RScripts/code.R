library(tidyverse)
library(here)
library(plotly)
library(htmlwidgets)
library(listviewer)

# Read health data
health_data <- read.csv(here('Data','present_health_data.csv')) %>% 
  select(country, code, healthexp_usd_percap_2019, mat_mort_2017)
  # wrong data for infant mort, and gdp data

# Read health exp gdp data from world bank (less missing data)
health_gdp_spend_raw <- read.csv(here('RawData','health_exp_gdp_world_bank.csv'))

# Link exp gdp data to health data
health_data <- left_join(health_data, health_gdp_spend_raw[,-1], by="code")
# health_exp_gdp_2019 column - using data from world bank. Same indicator as healthexp_pct_gdp_2019 but numbers way different?

# Health exp histo
ggplot(health_data,aes(x=healthexp_usd_percap_2019))+
  geom_histogram(bins=25)

# Health exp per cap USD equiv
health_data %>% 
  mutate(country=fct_reorder(country,healthexp_usd_percap_2019)) %>% 
  ggplot(aes(x=country, y=healthexp_usd_percap_2019))+
    geom_point()

# Health exp pct GDP
health_data %>% 
  mutate(country=fct_reorder(country,health_exp_gdp_2019)) %>% 
  ggplot(aes(x=country, y=health_exp_gdp_2019))+
  geom_point()

# Combine above plots
health_data %>% 
  mutate(country=fct_reorder(country,healthexp_usd_percap_2019)) %>% 
  filter(is.na(healthexp_usd_percap_2019)==F) %>% 
  ggplot(aes(x=country, group=1))+
  #geom_point(aes(y=healthexp_usd_percap_2019), colour="red")+
  geom_col(aes(y=healthexp_usd_percap_2019), colour="black", fill="red")+
  geom_point(aes(y=health_exp_gdp_2019*1000), colour="blue")+
  geom_segment(aes(xend = country, y=healthexp_usd_percap_2019 , yend = health_exp_gdp_2019*1000))+
  #geom_area(aes(y=healthexp_usd_percap_2019), fill="red")+
  scale_y_continuous(
    name = "Health Expenditure Per Capita (USD)",
    sec.axis = sec_axis(~./1000, name="Health Expenditure (% of GDP)")
  )

# Infant Mortality
#import the data from world bank
# Read health exp gdp data from world bank (less missing data)
infant_mort_raw <- read.csv(here('RawData','infant_mortality_raw_world_bank.csv'))

# Link exp gdp data to health data
health_data <- left_join(health_data, infant_mort_raw[,-1], by="code")

p_infant_vs_exp <- health_data %>% 
  ggplot(aes(x=healthexp_usd_percap_2019,y=infant_mort_2020))+
  geom_point()

p_infant<-health_data %>% 
  mutate(country=fct_reorder(country,healthexp_usd_percap_2019)) %>% 
  filter(is.na(healthexp_usd_percap_2019)==F) %>% 
  ggplot(aes(x=country, group=1))+
  geom_col(aes(y=healthexp_usd_percap_2019), colour="black", fill="red")+
  geom_point(aes(y=infant_mort_2020*100), colour="yellow")+
  geom_segment(aes(xend = country, y=healthexp_usd_percap_2019 , yend = infant_mort_2020*100))+
  scale_y_continuous(
    name = "Health Expenditure Per Capita (USD)",
    sec.axis = sec_axis(~./100, name="Infant Mortality (per 1,000 live births)")
  )

ggplotly(p_infant_vs_exp)
ggplotly(p_infant)
# https://plotly.com/r/multiple-axes/ - details to get 2 y axis for plotly

# Maternal Mortality
# Some missing data here > consider importing from world bank

health_data %>% 
  ggplot(aes(x=healthexp_usd_percap_2019,y=mat_mort_2017))+
  geom_point()

p_mat<-health_data %>% 
  mutate(country=fct_reorder(country,healthexp_usd_percap_2019)) %>% 
  filter(is.na(healthexp_usd_percap_2019)==F) %>% 
  ggplot(aes(x=country, group=1))+
  geom_col(aes(y=healthexp_usd_percap_2019), colour="black", fill="red")+
  geom_point(aes(y=mat_mort_2017*10), colour="yellow")+
  geom_segment(aes(xend = country, y=healthexp_usd_percap_2019 , yend = mat_mort_2017*10))+
  scale_y_continuous(
    name = "Health Expenditure Per Capita (USD)",
    sec.axis = sec_axis(~./10, name="Maternal Mortality (per 100,000 live births)")
  )

ggplotly(p_mat)

# Life expectancy (get the data)
life_exp_raw <- read.csv(here('RawData','life_expectancy_world_bank.csv'))
health_data <- left_join(health_data, life_exp_raw[,-1], by="code")

# Other health indicators - like <49 mortality, cancer deaths, smoking deaths

# Comparing how well a country does - Z score for a metric / Z score for expenditure?
mean_exp <- mean(health_data$healthexp_usd_percap_2019, na.rm=T)
sd_exp <- sd(health_data$healthexp_usd_percap_2019, na.rm=T)
mean_infant_mort <- mean(health_data$infant_mort_2020, na.rm=T)
sd_infant_mort <- sd(health_data$infant_mort_2020, na.rm=T)
mean_mat_mort <- mean(health_data$mat_mort_2017, na.rm=T)
sd_mat_mort <- sd(health_data$mat_mort_2017, na.rm=T)
mean_life_exp <- mean(health_data$life_exp_2019, na.rm=T)
sd_life_exp <- sd(health_data$life_exp_2019, na.rm=T)

transform_fn <- function(x) {
  return (log10(x))
}
health_data <- health_data %>% 
  mutate(
    healthexp_usd_percap_2019_z=(healthexp_usd_percap_2019-mean_exp)/sd_exp,
    infant_mort_2020_z=(infant_mort_2020-mean_infant_mort)/sd_infant_mort,
    mat_mort_2017_z=(mat_mort_2017-mean_mat_mort)/sd_mat_mort,
    life_exp_2019_z=(life_exp_2019-mean_life_exp)/sd_life_exp,
    # Below: transformed Z scores, Add constant to allow log transform neg values
    healthexp_usd_percap_2019_z_transformed=transform_fn(healthexp_usd_percap_2019_z+1),
    infant_mort_2020_z_transformed=transform_fn(infant_mort_2020_z+1),
    mat_mort_2017_z_transformed=transform_fn(mat_mort_2017_z+0.7), 
    life_exp_2019_z_transformed=transform_fn(life_exp_2019_z+3),
    )

# infant_vs_exp <- health_data %>% 
#   mutate(infant_mort_vs_exp=infant_mort_2020_z*healthexp_usd_percap_2019_z) %>% 
#   arrange(infant_mort_vs_exp)

p_infant_vs_exp_z <- health_data %>% 
  ggplot(aes(x=healthexp_usd_percap_2019_z,y=infant_mort_2020_z,
             text = paste("Infant Mortality:", infant_mort_2020, "country:", country))) +
  geom_point()

ggplotly(p_infant_vs_exp_z)

# log transformed infant_vs_exp
p_infant_vs_exp_z_transformed <- health_data %>% 
  ggplot(aes(x=healthexp_usd_percap_2019_z_transformed,y=infant_mort_2020_z_transformed,
             text = paste0("Infant Mortality: ", format(round(infant_mort_2020, 1), nsmall = 1), " /1,000 live births\n",
                          "Health Expenditure: ", healthexp_usd_percap_2019, " USD per capita\n",
                          "Country: ", country))) +
  geom_point()+
  geom_smooth(aes(group=1), se=F)

plotly0 <- ggplotly(p_infant_vs_exp_z_transformed, tooltip="text")

#plotly_json(plotly0)
#saveWidget(ggplotly(p_infant_vs_exp_z_transformed), "Output/infant_exp.html", selfcontained = F, libdir = "lib")

# mat vs exp
p_mat_vs_exp_z <- health_data %>% 
  ggplot(aes(x=healthexp_usd_percap_2019_z,y=mat_mort_2017_z,
             text = paste("Maternal Mortality:", mat_mort_2017, "/100,000 live births\n",
                          "Health Expenditure:", healthexp_usd_percap_2019, "USD per capita\n",
                          "Country:", country))) +
  geom_point()

ggplotly(p_mat_vs_exp_z)

# log transformed mat_vs_exp
p_mat_vs_exp_z_transformed <- health_data %>% 
  ggplot(aes(x=healthexp_usd_percap_2019_z_transformed,y=mat_mort_2017_z_transformed,
             text = paste0("Maternal Mortality: ", format(round(mat_mort_2017, 1), nsmall = 1), " /100,000 live births\n",
                          "Health Expenditure: ", healthexp_usd_percap_2019, " USD per capita\n",
                          "Country: ", country))) +
  geom_point()+
  geom_smooth(aes(group=1), se=F)

plotly1 <- ggplotly(p_mat_vs_exp_z_transformed, tooltip="text")

#plotly_json(plotly1)
#saveWidget(ggplotly(p_mat_vs_exp_z_transformed), "Output/mat_exp.html", selfcontained = F, libdir = "lib")

# Life vs exp
p_life_vs_exp_z <- health_data %>% 
  ggplot(aes(x=healthexp_usd_percap_2019_z,y=life_exp_2019_z,
             text = paste("country:", country))) +
  geom_point()

ggplotly(p_life_vs_exp_z)

# Log transformed life vs exp
p_life_vs_exp_z_transformed <- health_data %>% 
  ggplot(aes(x=healthexp_usd_percap_2019_z_transformed,y=life_exp_2019,
             text = paste0("Life Expectancy: ", format(round(life_exp_2019, 1), nsmall = 1), " years\n",
                          "Health Expenditure: ",healthexp_usd_percap_2019 , " USD per capita\n",
                          "Country: ", country))) +
  geom_point()+
  geom_smooth(aes(group=1), se=F)

plotly2 <- ggplotly(p_life_vs_exp_z_transformed,tooltip="text")

plotly_json(plotly2)
#saveWidget(ggplotly(p_life_vs_exp_z_transformed), "Output/life_exp.html", selfcontained = F, libdir = "lib")


#write.csv(health_data,here('Data','plot_data.csv'))
