import { Button } from "@mui/joy";
import { MainLayout } from "../layouts/mainLayout";
import FloatingLabelInput from "../components/inputLabel";
import { login } from "../services/login";
import { getCookie, setCookie } from "../helpers/cookies";

export function Login() {
    const handleSubmit = async(event) => {
        event.preventDefault();
        const token = await login({
            username: event.target.username.value,
            password: event.target.password.value
        })
        if(token){
            setCookie("token", token)
            // console.log(getCookie("token"));
            window.location.assign(location.origin)
        }else{
            alert("datos incorrectos")
        }
    }

    return (
        <MainLayout>
            <section className="h-full mt-16">
                <form onSubmit={(e) => handleSubmit(e)} className="mx-auto py-8 border w-[700px] flex items-center justify-center flex-col">
                    <h3 className="m-10 text-2xl font-semibold">Iniciar sesion</h3>
                    <FloatingLabelInput
                        className="w-[350px]"
                        label={"Nombre de usuario"}
                        placeholder={"example@example.com"}
                        type={"text"}
                        name="username"
                    />
                    <FloatingLabelInput
                        className="w-[350px] mt-8"
                        label={"Contraseña"}
                        type={"password"}
                        name="password"
                    />
                    <Button sx={{
                        backgroundColor: '#BF1717',
                        marginTop: '2.5rem',
                        paddingX: '2rem',
                        paddingY: '.7rem',
                        "&:hover": {
                            backgroundColor: '#bf1717c9'
                        }
                    }}
                        type="submit"
                    >INICIAR SESION</Button>
                </form>
            </section>
        </MainLayout>
    )
}