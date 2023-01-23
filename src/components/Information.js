import React from 'react'

const Information = () => {
  return (
      <div className="information">
          <hr />
        <h2>Which countries are getting the most health value for their money?</h2>
        <p>
              Spending more resources on Health services should result in better health outcomes. 
              However, lower income countries cannot compete with higher income countires and their spending, 
              and an improved method of comparison and evaluation of health metrics is required. 

              <br></br>
              <br></br>

              By using a fitted line (via LOESS regression algorithm) to visualise the expected health metric value
              for a certain value of health expenditure, countries can be evaluated to examine if they perform better or worse
              compared to other countries around their health spending level.

              <br></br>
              <br></br>

              When viewing "All Countries", the vertical distance between a country's data point and the fitted line determines 
              if it's health metric is better or worse than the expected value. Health metrics used include Infant Mortality (World Bank, 2020),
              Maternal Mortality (World Bank, 2017) and Life Expectancy (World Bank, 2019). Health Expenditure data (World Bank, 2019) is measured in USD per capita.
          </p>

      </div>
  )
}

export default Information