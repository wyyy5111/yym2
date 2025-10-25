import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/contexts/AuthContext';
import './ConsentFormPage.css';

const ConsentFormPage = () => {
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentDeclined, setConsentDeclined] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleAgree = () => {
    setConsentGiven(true);
    setConsentDeclined(false);
    
    // 保存用户同意状态
    localStorage.setItem('consentGiven', 'true');
    
    // 跳转到用户分类页面
    navigate('/user-classification', { replace: true });
  };

  const handleDisagree = () => {
    setConsentDeclined(true);
    setConsentGiven(false);
    // 用户不同意，清除登录状态并返回登录页
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="consent-container">
      <div className="consent-form">
        <div className="consent-header">
          <h1>心晴屿脑机计划小程序个人信息保护承诺书</h1>
        </div>
        
        <div className="consent-content">
          <p>欢迎使用"心晴屿脑机计划"小程序（以下简称"本小程序"）。我们严格遵循《中华人民共和国个人信息保护法》《中华人民共和国网络安全法》《中华人民共和国数据安全法》等相关法律法规，高度重视您的个人信息安全与合法权益保护。为明确本小程序个人信息处理的具体规则，特制定本承诺书，详细告知您个人信息的收集、使用、存储、保护等相关事宜，请您仔细阅读并理解。</p>
          
          <h2>一、信息收集范围</h2>
          <p>本小程序遵循"最小必要"原则，仅收集为提供服务所必需的个人信息，具体如下：</p>
          <ol>
            <li>账号注册与身份验证信息：您注册时提交的手机号、自定义用户名（可选），用于完成账号注册、登录验证及身份识别，保障账号使用安全。</li>
            <li>设备相关信息：使用本小程序时自动采集的设备识别码、硬件型号、操作系统版本、网络接入类型及状态等，用于适配设备功能、保障服务稳定性及防范安全风险。</li>
            <li>核心服务数据：通过您绑定的脑电设备采集的原始脑电波数据，及基于该数据衍生的情绪状态、注意力水平等分析数据，为提供情绪监测、专注力评估、个性化疗愈方案等核心服务提供依据。</li>
            <li>使用行为信息：您在使用本小程序过程中产生的操作日志（如检测发起、功能调用、设置调整）、页面浏览记录、服务使用频率等，用于优化产品功能、提升服务精准度。</li>
            <li>自愿补充信息：您主动填写的性别、年龄、职业、用户类型等身份相关信息，及自愿提交的情绪记录、备注内容等，仅用于细化服务适配，您可随时修改或删除。</li>
          </ol>
          
          <h2>二、信息使用规则</h2>
          <ol>
            <li>为您提供核心服务：基于收集的个人信息，为您生成情绪与注意力分析报告、个性化疗愈方案、"晴雨诊疗指南"等，保障本小程序核心功能的正常实现。</li>
            <li>优化产品与服务体验：根据您的使用行为、身份信息及服务数据，优化功能设计、调整服务适配策略，推送贴合您需求的服务提醒，提升本小程序的使用体验与服务质量。</li>
            <li>保障服务安全：通过设备信息、操作日志等识别异常登录、违规操作等风险行为，防范账号被盗、数据泄露、网络攻击等安全事件，维护您的合法权益及本小程序的正常运营秩序。</li>
            <li>合规性使用：在法律法规要求、司法机关或行政机关依法调取，或为保护您、他人合法权益及公共利益所必需的情况下，依法使用相关个人信息。</li>
            <li>匿名化数据应用：对收集的个人信息进行匿名化、去标识化处理后，可用于产品迭代、行业研究、服务优化等场景，该类数据无法关联到具体个人，不涉及个人隐私。</li>
          </ol>
          
          <h2>三、信息存储与保护</h2>
          <ol>
            <li>存储规范：您的个人信息将存储在符合国家法律法规要求的国内服务器，存储期限为实现服务目的所必需的最短时间。超出存储期限后，将依法对您的个人信息进行删除或匿名化处理。</li>
            <li>安全保障措施：采用SSL传输加密、AES存储加密等技术手段，对敏感个人信息全程加密保护；建立严格的权限管控体系，仅授权必要工作人员访问个人信息，访问行为全程留痕；部署防火墙、入侵检测系统、数据备份机制等安全防护设施，定期开展安全漏洞扫描与风险评估，防范数据泄露、篡改、丢失等风险。</li>
            <li>数据管理权限：您有权通过本小程序"个人中心-隐私设置"板块，查阅、更正、补充个人信息，申请导出或删除相关数据，管理信息查看与使用权限。数据删除后将无法恢复，请您谨慎操作。</li>
          </ol>
          
          <h2>四、信息共享与披露限制</h2>
          <ol>
            <li>未经您的明确书面授权，本小程序不会向任何第三方泄露、出售、出租、转让您的个人信息。</li>
            <li>为实现特定服务功能，需与具备合法资质的第三方服务提供商（如地图服务提供商）合作时，仅向其提供实现合作功能必需的最小范围个人信息，且要求第三方严格遵守相关法律法规及保密协议，不得将所获信息用于其他任何目的。</li>
            <li>因法律法规规定、司法机关或行政机关合法要求，或为保护您、他人合法权益及公共利益等特殊情形，需披露个人信息的，将严格按照法定程序执行，并对披露过程进行记录。</li>
          </ol>
          
          <h2>五、特别声明</h2>
          <ol>
            <li>本小程序提供的情绪分析数据、疗愈建议、评估报告等，仅为个人情绪自我监测、调节的参考工具，不构成专业医疗诊断意见，不能替代医疗机构及专业医师的诊断与治疗。</li>
            <li>若您存在持续情绪困扰（如焦虑、抑郁等）且影响正常生活、工作或学习，建议及时前往正规医疗机构的精神心理科就诊，寻求专业医疗帮助。</li>
            <li>未成年人使用本小程序需在监护人陪同下进行，监护人应履行监护职责，协助管理账号信息及使用行为，本小程序不向未成年人额外收集非必要个人信息。</li>
          </ol>
          
          <h2>六、您的权利与选择</h2>
          <ol>
            <li>您有权查阅、更正、补充个人信息，申请导出或删除相关数据，拒绝接收非必要的服务提醒，管理隐私设置与账号安全相关配置。</li>
            <li>您点击本承诺书下方"同意"按钮，即表示您已完整阅读、理解并接受本承诺书全部条款，同意我们按照本承诺书约定处理您的个人信息；若您选择"不同意"，将无法使用本小程序的核心服务功能，仅可浏览部分公开信息。</li>
            <li>本承诺书内容可能因法律法规更新或产品功能优化进行调整，更新后将通过本小程序显著位置公示（如登录页弹窗、公告栏），您继续使用本小程序服务即视为接受更新后的条款；若您不同意变更内容，可选择注销账号并停止使用服务。</li>
          </ol>
          
          <h2>七、联系方式</h2>
          <p>若您对个人信息保护有任何疑问、投诉或建议，可通过以下方式联系我们：</p>
          <ul>
            <li>小程序内反馈："个人中心-帮助中心-意见反馈"板块提交诉求</li>
            <li>官方客服邮箱：[指定官方客服邮箱]</li>
            <li>客服热线：[指定客服联系电话]</li>
          </ul>
          <p>我们将在收到您的反馈后15个工作日内完成核查并给予正式回复，依法保障您的个人信息权益。</p>
        </div>
        
        <div className="consent-actions">
          <div className="consent-options" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '20px' }}>
            <label className="consent-option" style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="consent" 
                value="disagree" 
                checked={consentDeclined}
                onChange={handleDisagree}
                style={{ marginRight: '8px' }}
              />
              <span>不同意</span>
            </label>
            
            <label className="consent-option" style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="consent" 
                value="agree" 
                checked={consentGiven}
                onChange={handleAgree}
                style={{ marginRight: '8px' }}
              />
              <span>同意</span>
            </label>
          </div>
          
          <p className="consent-note">注：本承诺书依据国家相关法律法规制定，最终解释权归本小程序运营主体（[运营主体全称]）所有。</p>
          <p className="consent-date">生效日期：{new Date().getFullYear()}年{String(new Date().getMonth() + 1).padStart(2, '0')}月{String(new Date().getDate()).padStart(2, '0')}日</p>
        </div>
      </div>
    </div>
  );
}

export default ConsentFormPage;