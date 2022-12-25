import './styles.css';

export function Input({ label, placeholder, change, ...rest }) {
    return(
        <div className='input-container'>
            <label label="input">{label}</label>
            <input placeholder={placeholder} name="input" onChange={change} {...rest}/>
        </div>
    );
}