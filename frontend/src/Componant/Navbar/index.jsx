import React, { useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";

export default function NavbarComponant() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        {/* Logo */}
        <h1 className={styles.logo} onClick={() => router.push("/")}>
          Social-Life
        </h1>

        {/* Hamburger (mobile) */}
        <div
          className={styles.menuIcon}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        {/* Logged-in User */}
        {authState.profileFetched && (
          <div
            className={`${styles.navbar__option} ${
              menuOpen ? styles.active : ""
            }`}
          >
            <p>Hey, {authState.user.userId?.name}</p>

            <p onClick={() => router.push("/profile")}>Profile</p>

            <p
              onClick={() => {
                localStorage.removeItem("token");
                dispatch(reset());
                router.push("/login");
              }}
            >
              Logout
            </p>
          </div>
        )}

        {/* Guest */}
        {!authState.profileFetched && (
          <div
            className={`${styles.navbar__option} ${
              menuOpen ? styles.active : ""
            }`}
            onClick={() => router.push("/login")}
          >
            <p className={styles.navbar__option__button}>Be a Pro</p>
          </div>
        )}
      </nav>
    </div>
  );
}
