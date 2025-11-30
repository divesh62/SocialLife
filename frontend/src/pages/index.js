import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";





export default function Home() {
  const router = useRouter();
  return (
    <UserLayout>
      <div className="">
      <div className={styles.mainContainer}>
        <div className={styles.mainContainer__left}>
          <p>Connect with Friends without Exaggaration</p>
          <p className={styles.typewriter}>A True social media platforms , with stories no blufs !</p>
          <div onClick={()=>{
            router.push("/login");
          }} className={styles.mainContainer__left_buttons}>
            <p>Join Now</p>
          </div>
        </div>
        <div className={styles.mainContainer__right}>
            <img width={550} style={{marginLeft:"100px"}} src="images/—Pngtree—teamwork concept people working in_6667637 (1).png" alt="Linkedin Logo" />
        </div>
      </div>
    </div>
    </UserLayout>
  );
}
