library(tidyverse)
library(here)
library(plotly)

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

health_data %>% 
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

# Other health indicators - like <49 mortality, cancer deaths, smoking deaths

# Comparing how well a country does - Z score for a metric / Z score for expenditure?

