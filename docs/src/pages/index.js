import Layout from '@theme/Layout'
import React from 'react'
import HomepageLogo from '../../static/img/Logo_Text_White.svg'
import { GettingStartedCards } from '../components/GettingStartedCards'
import ProjectsCards from '../components/ProjectsCards'
import { ShaderComponent } from '../components/ShaderComponent'
import { ToolsCards } from '../components/ToolsCards'
import styles from './index.module.css'

export default function Home() {
  return (
    <Layout>
      <ShaderComponent />
      <div>
        <HomepageLogo className={styles.logoText} />
        <h2 className={styles.headerSubtitle}>THE LEADING ART GENERATOR</h2>
      </div>
      <main className={styles.layout}>
        <div className={styles.layoutFlexBox}>
          <div className={styles.gettingStartedFlexBox}>
            <p className={styles.gettingStarted}>Getting Started</p>
            <a className={styles.viewAllLink} href="docs/guides/connect-wallet-react">
              <button className={styles.viewAll}>VIEW ALL</button>
            </a>
          </div>
          <GettingStartedCards />
          <p className={styles.tools}>Tools</p>
          <ToolsCards />
          <p className={styles.projects}>Projects Building on Elevate.Art</p>
          <ProjectsCards />
        </div>
      </main>
    </Layout>
  )
}
