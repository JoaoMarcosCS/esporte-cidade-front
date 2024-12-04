import React, { ChangeEvent } from "react";

interface DatepickerProps {
    label: string;
    name: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    iconPath?: string; // Ícone opcional
    errorMessage?: string; // Mensagem de erro opcional
}

const Datepicker: React.FC<DatepickerProps> = ({
    label,
    name,
    value,
    onChange,
    iconPath: icon,
    errorMessage,
}) => {
    return (
        <div className="relative">
            <label className="block text-sm font-semibold">{label}</label>
            <div className="relative">
                {icon && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <img src={icon} alt="" className="w-9"/>
                    </span>
                )}
                <input
                    required={true} 
                    type="date"
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`pl-12 pr-4 py-3 bg-[#d9d9d9] mt-1 block w-full border ${errorMessage ? "border-red-500" : "border-black"
                        } rounded-sm`}
                />
            </div>
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        </div>
    );
};

export default Datepicker;
