import React from 'react'
import { Card } from 'antd'
import ScrollToTopButton from './ScrollToTopButton'
// import AnimatedSection from '../utils/AnimatedSection'


function Home() {
  return (
    <div style={{margin:"100px auto", width:"100%"}}>
     <Card>
       <h1>Here is the home page</h1>
      </Card>

       {/* <AnimatedSection>
                <Dashboard/>
            </AnimatedSection>  */}


    <ScrollToTopButton />
    </div>
  )
}

export default Home
