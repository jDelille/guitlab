import { FaAngleDown } from 'react-icons/fa6';
import './TopControls.scss';

const Tunings = () => {

  const tunings = ["Standard", "E♭ Tuning"]

  return (
    <div className='tunings'>
        <p className="label">Tuning</p>
        <ul className="options">
          {tunings.map((tuning) => (
            <li key={tuning}>{tuning}</li>
          ))}
        </ul>
    </div>
  )
}

export default Tunings