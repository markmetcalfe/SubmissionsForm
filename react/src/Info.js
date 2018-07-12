import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class Info extends Component {
  render(){
    return(
        <Tabs defaultFocus={true}>
          <header className="tab">
          <TabList>
            <Tab>Zero Carbon Bill submission guide</Tab>
            <Tab>Key health messages</Tab>
            <div className="tab-slide"></div>
          </TabList>
          </header>
          <main className="tab">
          <TabPanel>
            <LeftTab />
          </TabPanel>
          <TabPanel>
            <RightTab />
          </TabPanel>
          </main>
        </Tabs>
    )
  }
}

class LeftTab extends Component {
  render(){
    return(<div>
      <h1>Zero Carbon Bill submission guide</h1>
      <p><b>Resources to help you:</b></p>
      <Indented>
        <p>To help you write your own submission, <a href="/files/Zero_Carbon_Act_submission_guide_for_HNGO_partnerships_FINAL_23.41_4_July_2018.pdf" target="_blank" rel="noopener noreferer">click here</a> for a fully referenced health submission guide.</p>
        <p>For more detail about why to set strong targets, and how climate action can improve health, click <a href="/files/Setting_ambitious_greenhouse_gas_emissions_targets_for_New_Zealand_–_the_case_for_international_fairness_equity.pdf" target="_blank" rel="noopener noreferer">here</a> and <a href="/files/Health_benefits_and_savings_of_equitable_climate_mitigation_in_New_Zealand.pdf" target="_blank" rel="noopener noreferer">here</a>.</p>
        <p><a href="/files/Setting_ambitious_greenhouse_gas_emissions_targets_for_New_Zealand_–_the_case_for_international_fairness_equity.pdf" target="_blank" rel="noopener noreferer">Setting ambitious targets – NZ being fair</a> as a global citizen</p>
        <p><a href="/files/Health_benefits_and_savings_of_equitable_climate_mitigation_in_New_Zealand.pdf" target="_blank" rel="noopener noreferer">Win-wins in health</a></p>
        <p>For information on climate change and health in New Zealand, <a href="http://www.nzma.org.nz/journal/read-the-journal/all-issues/2010-2019/2014/vol-127-no-1406/6366" target="_blank" rel="noopener noreferer">click here</a>.</p>
        <p>For the Ministry for the Environment’s discussion document, click <a href="https://www.mfe.govt.nz/sites/default/files/media/Consultations/FINAL-%20Zero%20Carbon%20Bill%20-%20Discussion%20Document.pdf" target="_blank" rel="noopener noreferer">here</a></p>
      </Indented>
      <p><b>Now it’s your turn!</b></p>
      <Indented>
        <p>Please make your submission <b>before 5pm Thursday 19 July</b></p>
      </Indented>
      <Indented>
        <p>Encourage your whānau, workmates, flatmates, friends, neighbours, colleagues, and professional organisations, to have their say.</p>
      </Indented>
      <Submit />
      <SocialIcons />
      <p>We know NZ can get huge health and productivity gains from well-designed fast climate action. The sooner we act, the easier the transition and the greater the gains. Wealthy countries, including New Zealand, must share responsibility for climate changes already happening.</p>
      <p>As health workers, let’s call now for a <b>fast, fair, firm, Tiriti-founded Zero Carbon Bill</b> – for health’s sake.</p>
    </div>)
  }
}

class RightTab extends Component {
  render(){
    return(<div>
      <h1>Key health messages</h1>
      <p><b>A healthy, fast, fair, firm, and Tiriti-founded Net Zero Carbon Bill</b></p>
      <p><b>New Zealand needs:</b></p>
      <ul>
        <li>a Zero Carbon Act that is fast, fair, firm, and founded on Te Tiriti, with health and wellbeing at its heart</li>
        <li>a <b>1.5°C</b> net zero emissions target “<b>by 2040</b>” set in law now (<b>all gases</b>, plus plants and soil)</li>
        <li>our Climate Commission to:
          <ul>
            <li><b>set transparent 5-6 year Emissions Budgets</b> – by considering scientific knowledge, global leadership, and international fairness</li>
            <li><b>advise on mitigation</b> (including ETS) <b>and adaptation policies</b> that create a fair, just and sustainable Aotearoa-NZ founded on Te Tiriti</li>
            <li><b>monitor and annually report publicly</b> on New Zealand’s progress in staying within the emissions budgets</li>
            <li><b>involve Commissioners with diverse experience</b> – including climate science, health and Tiriti o Waitangi.</li>
          </ul>
        </li>
        <li>Governments can act so NZ emits less – but for ongoing <b>certainty</b>, Budgets should only increase by changing the Act.</li>
      </ul>
      <Submit />
      <SocialIcons />
    </div>)
  }
}

class Indented extends Component {
  render(){
    return(
      <div className="indented">{this.props.children}</div>
    )
  }
}

class Submit extends Component {
  render(){
    return(
      <div className="submit-now">
        <a href="/" >Submit Now!</a>
      </div>
    )
  }
}

class SocialIcons extends Component {
  render(){
    return(
      <div className="social-icons">
        <h1>Share This!</h1>
        <a title="Share the submission via Email" rel="noopener noreferrer" target="_blank" href="mailto:?subject=Make%20a%20submission%20on%20the%20Zero%20Carbon%20Bill!&body=I've%20just%20completed%20my%20submission%20on%20the%20Zero%20Carbon%20Bill%2C%20and%20you%20should%20too!%0AI%20used%20this%20easy%20form%20here%3A%20https%3A%2F%2Fzerocarbonbillhealth.org.nz"><img src="/share-email.png" className="hover-enlarge" /></a>        
        <a title="Share the submission via Facebook" rel="noopener noreferrer" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fzerocarbonbillhealth.org.nz"><img src="/share-fb.png" className="hover-enlarge" /></a>        
        <a title="Share the submission via Twitter" rel="noopener noreferrer" target="_blank" href="https://twitter.com/home?status=I%20just%20made%20a%20submission%20to%20get%20the%20best%2C%20most%20ambitious%20%23climate%20law%20for%20Aotearoa%20NZ!%20And%20you%20should%20too!%20https%3A%2F%2Fzerocarbonbillhealth.org.nz%20%23ZeroCarbonAct%20%23OurClimateYourSay"><img src="/share-twitter.png" className="hover-enlarge" /></a>
      </div>
    )
  }
}

export default Info;
