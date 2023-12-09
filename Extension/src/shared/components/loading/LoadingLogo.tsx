import logo from '../../../assets/images/LightLogoCrop.png';

const LoadingLogo = () => {
  return (
    <div className='flex items-center justify-center animate-pulse h-[50vh]'>
      <img src={logo} alt="" />
    </div>
  )
}

export default LoadingLogo
