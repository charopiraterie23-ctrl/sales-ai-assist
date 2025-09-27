import Layout from '@/components/layout/Layout';
import EmailTemplateEditor from '@/components/templates/EmailTemplateEditor';

const TemplatesPage = () => {
  return (
    <Layout title="Templates" showNavbar={true}>
      <EmailTemplateEditor />
    </Layout>
  );
};

export default TemplatesPage;