export default function Login() {
  return (
    <div style={{
      width: 501, height: 339, minWidth: 320, padding: 24,
      background: 'white',
      borderRadius: 8, border: '1px solid #D9D9D9',
      flexDirection: 'column',
      justifyContent: 'flex-start', alignItems: 'flex-start',
      gap: 24, display: 'inline-flex'
    }}>
      <div style={{
        alignSelf: 'stretch', flexDirection: 'column',
        justifyContent: 'flex-start', alignItems: 'flex-start',
        gap: 8, display: 'flex'
      }}>
        <div style={{ color: '#1E1E1E', fontSize: 16, fontFamily: 'Inter' }}>Email</div>
        <div style={{
          alignSelf: 'stretch', minWidth: 240, padding: '12px 16px',
          background: 'white', borderRadius: 8,
          border: '1px solid #D9D9D9', display: 'inline-flex',
          justifyContent: 'flex-start', alignItems: 'center'
        }}>
          <input placeholder="Enter email" style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: 16, fontFamily: 'Inter'
          }} />
        </div>
      </div>

      <div style={{
        alignSelf: 'stretch', flexDirection: 'column',
        justifyContent: 'flex-start', alignItems: 'flex-start',
        gap: 8, display: 'flex'
      }}>
        <div style={{ color: '#1E1E1E', fontSize: 16, fontFamily: 'Inter' }}>Password</div>
        <div style={{
          alignSelf: 'stretch', minWidth: 240, padding: '12px 16px',
          background: 'white', borderRadius: 8,
          border: '1px solid #D9D9D9', display: 'inline-flex',
          justifyContent: 'flex-start', alignItems: 'center'
        }}>
          <input type="password" placeholder="Enter password" style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: 16, fontFamily: 'Inter'
          }} />
        </div>
      </div>

      <div style={{
        alignSelf: 'stretch', display: 'inline-flex',
        justifyContent: 'flex-start', alignItems: 'center', gap: 16
      }}>
        <button style={{
          flex: 1, padding: 12, background: '#2C2C2C',
          borderRadius: 8, border: 'none',
          color: '#F5F5F5', fontSize: 16, fontFamily: 'Inter',
          cursor: 'pointer'
        }}>
          Sign In
        </button>
      </div>

      <div style={{
        alignSelf: 'stretch', display: 'inline-flex',
        justifyContent: 'flex-start'
      }}>
        <a href="#" style={{
          color: '#1E1E1E', fontSize: 16, fontFamily: 'Inter',
          textDecoration: 'underline'
        }}>
          Forgot password?
        </a>
      </div>
    </div>
  );
}
