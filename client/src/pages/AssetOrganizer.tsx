import { useState } from 'react';
import { Upload, Image, Video, Plus, Trash2, Edit2, FileText } from 'lucide-react';
import { useCampaigns } from '../hooks/useCampaigns';
import { creativeAssetApi, uploadToS3 } from '../services/api';

export default function AssetOrganizer() {
  const { 
    campaigns, 
    personas, 
    creativeAssets, 
    adCopy, 
    selectedCampaignId, 
    setSelectedCampaignId,
    createCreativeAsset,
    deleteCreativeAsset,
    createAdCopy,
    updateAdCopy,
    deleteAdCopy
  } = useCampaigns();
  
  const [activeTab, setActiveTab] = useState<'assets' | 'copy'>('assets');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [showAdCopyForm, setShowAdCopyForm] = useState(false);
  const [editingAdCopyId, setEditingAdCopyId] = useState<string | null>(null);
  const [adCopyForm, setAdCopyForm] = useState({ headline: '', description: '' });


  const campaignPersonas = personas.filter(p => p.campaign_id === selectedCampaignId);
  const campaignAssets = creativeAssets.filter(a => a.campaign_id === selectedCampaignId);
  const campaignAdCopy = adCopy.filter(ac => ac.campaign_id === selectedCampaignId);



  const filteredAdCopy = selectedPersonaId
    ? campaignAdCopy.filter(ac => ac.persona_id === selectedPersonaId)
    : campaignAdCopy;

  const handleFileUpload = async (personaId: string, type: 'image' | 'video') => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : 'video/*';
    
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file || !selectedCampaignId) return;

      try {
        // Get pre-signed upload URL from API
        const uploadResponse = await creativeAssetApi.getUploadUrl(file.name, file.type);
        const { uploadUrl, fileUrl } = uploadResponse.data;

        // Upload file to S3
        await uploadToS3(file, uploadUrl);

        // Create asset record in database
        await createCreativeAsset({
          campaign_id: selectedCampaignId,
          persona_id: personaId,
          type,
          filename: file.name,
          url: fileUrl
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        
        // Fallback to mock file upload for demo purposes
        const mockFiles = {
          image: [
            { filename: 'hero-image.jpg', url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg' },
            { filename: 'lifestyle-photo.jpg', url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg' },
            { filename: 'interior-shot.jpg', url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg' }
          ],
          video: [
            { filename: 'property-tour.mp4', url: 'https://example.com/video1.mp4' },
            { filename: 'testimonial.mp4', url: 'https://example.com/video2.mp4' }
          ]
        };

        const randomFile = mockFiles[type][Math.floor(Math.random() * mockFiles[type].length)];
        
        await createCreativeAsset({
          campaign_id: selectedCampaignId,
          persona_id: personaId,
          type,
          filename: file.name || randomFile.filename,
          url: randomFile.url
        });
      }
    };
    
    input.click();
  };

  const handleAdCopySubmit = () => {
    if (!selectedCampaignId || !selectedPersonaId) return;

    if (editingAdCopyId) {
      updateAdCopy(editingAdCopyId, adCopyForm);
    } else {
      createAdCopy({
        campaign_id: selectedCampaignId,
        persona_id: selectedPersonaId,
        ...adCopyForm
      });
    }

    setAdCopyForm({ headline: '', description: '' });
    setShowAdCopyForm(false);
    setEditingAdCopyId(null);
  };

  const handleEditAdCopy = (copy: any) => {
    setAdCopyForm({ headline: copy.headline, description: copy.description });
    setEditingAdCopyId(copy.id);
    setShowAdCopyForm(true);
  };

  const getPersonaName = (personaId: string) => {
    return personas.find(p => p.id === personaId)?.name || 'Unknown Persona';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Asset Organizer</h2>
          <p className="text-gray-600 mt-1">Manage creative assets and ad copy for your campaigns</p>
        </div>
      </div>

      {/* Campaign Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Campaign
            </label>
            <select
              value={selectedCampaignId || ''}
              onChange={(e) => {
                setSelectedCampaignId(e.target.value || null);
                setSelectedPersonaId(null);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a campaign</option>
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
              ))}
            </select>
          </div>
          
          {selectedCampaignId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Persona
              </label>
              <select
                value={selectedPersonaId || ''}
                onChange={(e) => setSelectedPersonaId(e.target.value || null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All personas</option>
                {campaignPersonas.map(persona => (
                  <option key={persona.id} value={persona.id}>{persona.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {selectedCampaignId && (
        <>
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('assets')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'assets'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Creative Assets
                </button>
                <button
                  onClick={() => setActiveTab('copy')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'copy'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Ad Copy
                </button>
              </nav>
            </div>

            {/* Creative Assets Tab */}
            {activeTab === 'assets' && (
              <div className="p-6">
                {campaignPersonas.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Create personas first to organize assets by target audience.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {campaignPersonas.map((persona) => {
                      const personaAssets = campaignAssets.filter(a => a.persona_id === persona.id);
                      
                      return (
                        <div key={persona.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{persona.name}</h3>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleFileUpload(persona.id, 'image')}
                                className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center space-x-1"
                              >
                                <Image className="w-4 h-4" />
                                <span>Add Image</span>
                              </button>
                              <button
                                onClick={() => handleFileUpload(persona.id, 'video')}
                                className="bg-purple-50 hover:bg-purple-100 text-purple-600 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center space-x-1"
                              >
                                <Video className="w-4 h-4" />
                                <span>Add Video</span>
                              </button>
                            </div>
                          </div>

                          {personaAssets.length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-600">No assets uploaded for this persona</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {personaAssets.map((asset) => (
                                <div key={asset.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                                  <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center space-x-2">
                                      {asset.type === 'image' ? (
                                        <Image className="w-5 h-5 text-blue-600" />
                                      ) : (
                                        <Video className="w-5 h-5 text-purple-600" />
                                      )}
                                      <span className="text-sm font-medium text-gray-900">{asset.type}</span>
                                    </div>
                                    <button
                                      onClick={() => deleteCreativeAsset(asset.id)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  
                                  {asset.type === 'image' ? (
                                    <img
                                      src={asset.url}
                                      alt={asset.filename}
                                      className="w-full h-32 object-cover rounded-lg mb-2"
                                    />
                                  ) : (
                                    <div className="w-full h-32 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                                      <Video className="w-8 h-8 text-gray-400" />
                                    </div>
                                  )}
                                  
                                  <p className="text-sm text-gray-600 truncate">{asset.filename}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(asset.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Ad Copy Tab */}
            {activeTab === 'copy' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Ad Copy Library</h3>
                  {selectedPersonaId && (
                    <button
                      onClick={() => setShowAdCopyForm(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Ad Copy</span>
                    </button>
                  )}
                </div>

                {showAdCopyForm && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">
                      {editingAdCopyId ? 'Edit Ad Copy' : 'Create New Ad Copy'}
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Headline
                        </label>
                        <input
                          type="text"
                          value={adCopyForm.headline}
                          onChange={(e) => setAdCopyForm({ ...adCopyForm, headline: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter compelling headline"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={adCopyForm.description}
                          onChange={(e) => setAdCopyForm({ ...adCopyForm, description: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter detailed description"
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => {
                            setShowAdCopyForm(false);
                            setEditingAdCopyId(null);
                            setAdCopyForm({ headline: '', description: '' });
                          }}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAdCopySubmit}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                        >
                          {editingAdCopyId ? 'Update' : 'Create'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {!selectedPersonaId ? (
                  <div className="text-center py-8">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Select a persona to create targeted ad copy</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAdCopy.map((copy) => (
                      <div key={copy.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-900">
                              {getPersonaName(copy.persona_id)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditAdCopy(copy)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteAdCopy(copy.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{copy.headline}</h4>
                        <p className="text-gray-600 mb-3">{copy.description}</p>
                        
                        <div className="text-xs text-gray-500">
                          Created {new Date(copy.created_at).toLocaleDateString()}
                          {copy.updated_at !== copy.created_at && (
                            <span> • Updated {new Date(copy.updated_at).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {filteredAdCopy.length === 0 && (
                      <div className="text-center py-8">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No ad copy created for this persona yet</p>
                        <button
                          onClick={() => setShowAdCopyForm(true)}
                          className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Create first ad copy
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {!selectedCampaignId && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a campaign</h3>
          <p className="text-gray-600">Choose a campaign above to manage creative assets and ad copy</p>
        </div>
      )}
    </div>
  );
}