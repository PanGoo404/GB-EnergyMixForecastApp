interface Props{
    message: string;
    onClose: () => void;
}

const ErrorPopup = ({message, onClose}: Props) =>{
return(
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(146, 146, 146, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(3px)'
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '16px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        border: '1px #000000ff'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>ERROR</div>
        <h3 style={{ margin: '0 0 10px 0'}}>Wystąpił błąd</h3>
        <p style={{ color: '#4b5563', marginBottom: '20px', lineHeight: '1.5' }}>
          {message}
        </p>
        <button 
          onClick={onClose}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '10px',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Zamknij
            </button>
      </div>
    </div>
    );
};

export default ErrorPopup;