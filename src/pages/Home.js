import Navbar from '../components/Navbar'
import '../styles/Home.css'
import '../styles/general.css'
import reveal from '../functions/Reveal'
const Home = () =>{
  window.addEventListener("scroll", reveal);
  return (
    <>
    <Navbar/>
    <div className="home-main-body">
      <div className="main-panel">
        <div>
          <div>
        <div className="app-name">Gains Diary</div>
        <hr className="hr-line"/>
        <div className="app-slogan">Where Hard Work Becomes Hard Data</div>
            <div className="start-button-container">
              <div className="start-button snd-button"><div>Get started now</div><span></span><span></span><span></span><span></span></div>

            </div>
          </div>
        </div>
      </div>
    </div>
      <div className="about-section">
        <div className="card-overlay">
          <div>
            <div className="about-title">Our services</div>
            <div className="about-content">Unlock your fitness potential with our website, where you can effortlessly track, plan, and maximize your gains with the power of our innovative tools and expert guidance. Join us on the journey to a healthier, stronger you, and experience the ultimate transformation in your fitness journey.</div>
          </div>
        </div>
      </div>
      <div className="about-cards-section ">
            <div>
            <div className="about-card reveal">
              <div className="about-card-title">Workout tracking</div>
              <div className="about-card-title">1</div>
              <div className="about-card-content">Track your workouts with ease with our website. You no longer will need to bring notebooks to your gym just to remember what weights to lift or for how long to run.</div>
              <div className="snd-button read-more-btn">Read more</div>
            </div>
            <div className="about-card reveal second-card">
              <div className="about-card-title">Maximize Efficiency</div>
              <div className="about-card-title">2</div>
              <div className="about-card-content">With our website, you can meticulously plan your workouts ahead of time, ensuring every minute in the gym counts. Create detailed routines, set specific goals, and stay on track like a pro.</div>
              <div className="snd-button read-more-btn">Read more</div>
            </div>
              <div className="about-card reveal">
                <div className="about-card-title">Visualize Progress</div>
                <div className="about-card-title">3</div>
                <div className="about-card-content"> Our website displays easy-to-read diagrams of your workout progress, helping you visualize how far you've come. Track your improvements, identify weak points, and stay motivated to reach your fitness goals.</div>
                <div className="snd-button read-more-btn">Read more</div>
              </div>
            </div>

      </div>
      <div className="sign-up-section">
        <div>
          <div className="sign-up-info">
            <div>We know
              <span className="boldSans"> fitness </span>
              can be overwhelming, but with
              <span className="boldSans"> Gains with Brains</span>,
              it's simplified. Let us handle the
              <span className="boldSans"> brains</span>
              ; you focus on your
              <span className="boldSans"> gains</span>
              . You'll wonder how you ever lived without it!</div>

          </div>
          <div className="sign-up-form">
            <div className="sign-up-title">SIGN UP</div>
            <div className="divCenter">
            <form>
              <input
                type="email"
                className="sign-up-input"
                id="email"
                name="email"
                placeholder="Your Email"
                required={true}
              />
              <input
                type="password"
                className="sign-up-input"
                id="password"
                name="password"
                placeholder="Your Password"
                required={true}
              />
              <input
                type="password"
                className="sign-up-input"
                id="password-check"
                name="password-check"
                placeholder="Repeat password"
                required={true}
              />
              <div className="divCenter"><input className="prm-button sign-up-btn" type="submit" value="Let's start"/></div>
            </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home