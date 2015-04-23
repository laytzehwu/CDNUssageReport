<section>
 <h2>CDN Usage report</h2>
 <p>This is not an actual software. The goal for this project to help proving some javascript app developing idea.</p>
</section>
<section>
  <h2>Dataflow</h2>
  <p>The usage report fetch data from backend API and make those data more visible and useful.</p>
  <p>It is design as Javascript app. The app retrieve the data when it is starting. Those data is cached in local browser, new data will be reloaded only while user refresh the page.</p>
</section>
<section id="tdd">
 <h2>TDD - Test Driven Development</h2>
 <p>Because of rarely to have any new project, I take an opportunity to do this project via TDD. </p>
 <p>Javascript does more logic with the user interface, it is hard to develop user interface logic via TDD. Only models and content generating logic can be implemented via TDD.</p>
</section>
<section id="responsive">
 <h2>Responsive Web Design</h2>
 <p>Try to make your browser to smaller size then you can start the mobile experience</p>
</section>
<section id="File_Structure">
 <h2>Files Dictionary</h2>
 <dl>
  <dt>Spec Runner</dt>
  <dd>SpecRunner.html - To make sure all the logic is doing well.</dd>
  <dt>src</dt>
  <dd>
   Source folder. All the javascript source files are kept here.
   <ul>
    <li><strong>CDNUsageModel.js</strong> - Model objects</li>
    <li><strong>CDNUsageView.js</strong> - Presentation</li>
   </ul>
  </dd>
  <dt>spec</dt>
  <dd>
   Spec folder keeps all the unit test scripts.
   <ul>
    <li><strong>CDNUsageModelSpec.js</strong> - Model objects spec</li>
    <li><strong>CDNUsageViewSpec.js</strong> - Presentation spec</li>
   </ul>
  </dd>
  <dt>Assets</dt>
  <dd>
   assets folder hold HTML assets like CSS, images and demo data.
   <ul>
    <li>sample.json - Sample data in JSON</li>
   </ul>
  </dd>
 </dl>
</section>
