import Layout from '../components/Layout'
import Mention from "../components/Mention";

import { sampleUserData as users } from '../utils/sample-data'

const IndexPage = () => (
  <Layout title="User Mentions | Next.js + TypeScript">

    <Mention users={users} limit={5} />

  </Layout>
)

export default IndexPage
